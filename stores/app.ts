import { defineStore } from 'pinia';
import pjson from '~/package.json';
import dateformat from 'dateformat';
import songs from '~/chords.json';
import Fuse from 'fuse.js';
import debounce from 'lodash/debounce';
import { ref as dbRef, get as dbGet, update as dbUpdate } from 'firebase/database';
import { transposeMap, chordNotesMap } from '~/utils/chords';
import { db } from '~/utils/firebase';

export { transposeMap, chordNotesMap };

// debounce + first-filter guard live in module scope (single store instance)
const debouncedFilterSongs = debounce((store: any) => {
  store.filterSongs();
}, 100);

let isFirstFilter = true;
const startTime = Date.now();

export const useAppStore = defineStore('app', {
  state: () => ({
    // data
    songs: songs as any[],
    filteredSongs: [] as any[],

    // constants
    name: pjson.name,
    version: pjson.version,
    description: pjson.description,
    homepage: pjson.homepage,
    // global feature flag: when false, all QR code UI (the header scanner and
    // the per-song QR display in toolbars / song items) is hidden.
    qrCodeEnabled: false,

    // app state
    activeSong: { title: '' } as any,
    transposeLevel: 0,
    defaultTransposeLevel: 0,
    scroller: false,
    autoscroll: false,
    playlist: [] as any[],
    playlistCurrent: -1,
    queue: [] as string[],
    toolbarHidden: false,
    shows: {} as Record<string, number>,
    comments: {} as Record<string, any>,
    user: false as any,
    lastOffset: 0,
    beatFirstPlay: true,
    beatCustomInstruments: false as any,
    beatProgress: 0,
    beatPlaying: false,

    // settings
    fontSize: 2,
    autoScrollSpeed: 4,
    instrument: 'guitar',
    artistsSort: 'name',
    readerMode: false,
    showSize: true,
    showImages: false,
    showBadges: false,
    showShows: true,
    showBeats: true,
    // transient (not persisted): is the beats panel expanded for the active song.
    // Store-backed instead of SongItem-local so the mobile virtual scroller can
    // recycle/re-render the item without losing the open panel (was closing itself).
    showBeatControls: false,
    // transient (not persisted, default off): switch chord lines from wrapping to
    // horizontal scroll for the active song. Resets when the active song changes.
    chordNowrap: false,
    noSleep: false,
    darkMode: undefined as boolean | undefined,

    // filters
    filter: {
      q: '',
      withChords: -1 as number | string,
      withTexts: -1 as number | string,
      beats: -1 as number | string,
      sortByDate: true,
      sortByShows: false,
      comments: -1 as number | string,
    },

    webhookShow: '',
  }),

  getters: {
    lastUpdated(state): string {
      const date = Math.max.apply(
        Math,
        state.songs.map((song: any) => new Date(song.created) as any),
      );
      return dateformat(new Date(date), 'dd.mm.yyyy');
    },

    activeSongTitle(state): string {
      if (!state.activeSong.title) return '';
      let title = state.activeSong.title;
      if (state.activeSong.details) {
        title = state.activeSong.details.artist + ' - ' + state.activeSong.details.title;
      }
      title = title.trim(',');
      return title;
    },

    activeSongNum(state): number {
      if (!state.activeSong.url) return -1;
      return state.songs.findIndex((song: any) => song.url === state.activeSong.url);
    },

    replacedChord() {
      return (chord: string) => chord
        .replace(/H(\s)/, /B$1/ as any)
        .replace(/^H$/, 'B')
        .replace(/^H7$/, 'B7')
        .replace('Hm', 'Bm')
        .replace('m#', '#m')
        .replace('Ab', 'G#')
        .replace('Bb', 'A#')
        .replace('Cb', 'B#')
        .replace('Db', 'C#')
        .replace('Eb', 'D#')
        .replace('Fb', 'E#')
        .replace('Gb', 'F#')
        .replace(/[()]/g, '');
    },

    isKnownChord(): (chord: string) => any {
      return (chord: string) => {
        return transposeMap.find(chain => chain.indexOf(this.replacedChord(chord)) !== -1) || false;
      };
    },

    transposeChord(): (chord: string, level: number) => string {
      return (chord: string, level: number) => {
        chord = this.replacedChord(chord);
        if (!chord) return '';

        if (!chord || level === 0) return chord;

        // find chord's chain
        const chain = transposeMap.find(chain => chain.indexOf(chord) !== -1);
        if (!chain) {
          return chord;
        }

        // iterate over chain at level
        let currentIndex = chain.indexOf(chord);
        for (let i = 0; i < Math.abs(level); i++) {
          if (level > 0) {
            currentIndex = currentIndex + 1 >= chain.length ? 0 : currentIndex + 1;
          } else {
            currentIndex = currentIndex - 1 < 0 ? chain.length - 1 : currentIndex - 1;
          }
        }
        return chain[currentIndex];
      };
    },
  },

  actions: {
    changeFilter(options: { name: string; value: any }) {
      this.filter[options.name as keyof typeof this.filter] = options.value;

      if (isFirstFilter) {
        this.filterSongs();
        isFirstFilter = false;
      } else {
        const uptime = Date.now() - startTime;
        if (uptime < 2000) return; // fix double filter on start

        // loading placeholder if all songs filter
        if (this.filter.q === '') {
          this.filteredSongs = [{
            title: 'Loading...',
            url: 'loading',
            text: 'loading',
            created: '',
            details: {
              artist: 'Songs',
              title: 'Loading...',
            },
          }];
        }

        debouncedFilterSongs(this);
      }
    },

    async filterSongs() {
      // webhookShow
      const webhookCommand = this.filter.q.match(/^webhookShow=(.*)$/);
      if (webhookCommand) {
        const webhookShow = webhookCommand[1];
        console.log('set webhookShow: ', webhookShow);
        this.webhookShow = webhookShow;

        // store to firebase
        if (this.user) {
          const userRef = dbRef(db, 'users/' + this.user.uid);
          const snapshot = await dbGet(userRef);
          const settings = {
            ...(snapshot.val()?.settings || {}),
            ...{ webhookShow },
          };
          dbUpdate(userRef, { settings });
        }

        return;
      }

      const q = this.filter.q.toLowerCase();
      let result = this.songs;

      // data modify
      result = result.map((song: any) => {
        // song.genre
        const g = song.tags.map((tag: string) => {
          if (tag.indexOf('жанр:') === 0) return tag.replace('жанр: ', '');
        });
        song.genres = g.filter(Boolean);

        return song;
      });

      if (q) {
        const isLetter = q.match(/\^.$/);
        const isArtist = q.match(/\^.*$/);
        const isGenre = q.match(/^жанр:.*$/);
        if (isLetter) {
          result = result.filter((song: any) => song.title.toLowerCase().search(q) >= 0);
        } else if (isArtist) {
          result = result.filter(
            (song: any) => song.details && song.details.artist.toLowerCase().search(q) >= 0,
          );
        } else if (isGenre) {
          const g = this.filter.q.replace('жанр: ', '');
          if (g === 'next') {
            result = result.filter((song: any) => this.queue.includes(song.url));
          } else {
            result = result.filter((song: any) => song.genres && song.genres.includes(g));
          }
        } else {
          const isFuse = false;

          if (isFuse) {
            const fuse = new Fuse(result, {
              minMatchCharLength: 2,
              keys: [
                { name: 'title', weight: 0.7 },
                { name: 'text', weight: 0.5 },
              ],
            });
            result = fuse.search(q).map((r: any) => r.item);
          } else {
            // without fuse
            result = result.filter((song: any) => {
              return (
                song.title.toLowerCase().search(q) >= 0 ||
                (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
              );
            });
          }
        }
      }

      // filters

      if (this.filter.withChords === '1') {
        result = result.filter((song: any) => song.details.chords);
      }

      if (this.filter.withChords === '0') {
        result = result.filter((song: any) => !song.details.chords);
      }

      if (this.filter.withTexts === '1') {
        result = result.filter((song: any) => song.text);
      }

      if (this.filter.withTexts === '0') {
        result = result.filter((song: any) => !song.text);
      }

      if (this.filter.comments === '1') {
        result = result.filter((song: any) => {
          const safeUrl = song.url.replace(/[\/.]/g, '_');
          return !!this.comments[safeUrl];
        });
      }
      if (this.filter.comments === '0') {
        result = result.filter((song: any) => {
          const safeUrl = song.url.replace(/[\/.]/g, '_');
          return !this.comments[safeUrl];
        });
      }

      if (this.filter.beats === '1') {
        result = result.filter((song: any) => !!song.beat?.name);
      }

      if (this.filter.sortByDate) {
        result = result
          .slice()
          .sort((a: any, b: any) => (new Date(b.created) as any) - (new Date(a.created) as any));
      }

      if (this.filter.sortByShows) {
        result = result.slice().sort((a: any, b: any) => {
          const aSafe = a.url.replace(/[\/.]/g, '_');
          const bSafe = b.url.replace(/[\/.]/g, '_');
          const aShows = this.shows[aSafe] || 0;
          const bShows = this.shows[bSafe] || 0;
          return bShows - aShows || ((new Date(b.created) as any) - (new Date(a.created) as any));
        });
      }

      // queue ("next") keeps the order songs were added in
      if (this.filter.q === 'жанр: next') {
        result = this.queue
          .map(url => result.find((song: any) => song.url === url))
          .filter(Boolean);
      }

      this.filteredSongs = result;
    },

    toggleChordNowrap() {
      this.chordNowrap = !this.chordNowrap;
    },

    toggleQueue(url: string) {
      const queue = this.queue.includes(url)
        ? this.queue.filter(u => u !== url)
        : [...this.queue, url];
      this.queue = queue;
      if (this.filter.q === 'жанр: next') this.filterSongs();
    },

    clearQueue() {
      this.queue = [];
      if (this.filter.q === 'жанр: next') this.changeFilter({ name: 'q', value: '' });
    },

    updateTranspose() {
      const songTranspose = this.activeSong.title?.match(
        /\((капо|кап|capo|cap)\.? (\d+)\)/,
      );
      const transpose = songTranspose ? songTranspose[2] * -1 : 0;
      this.defaultTransposeLevel = transpose;
      this.transposeLevel = transpose;
    },

    changeSong(url: string) {
      const activeSong = this.songs.find((song: any) => song.url === url) || {};
      if (this.activeSong.url === url) return;

      this.activeSong = activeSong;
      this.showBeatControls = false; // collapse beats panel when switching songs
      // chordNowrap is (re)derived per song open by SongItem.measureChordsOverflow
      // (default ON when chord lines overflow) — not reset here, to avoid racing
      // that auto-apply. It is transient (not persisted) and re-measured each open.
      this.updateTranspose();
      this.playlistCurrent = this.playlistCurrent + 1;
      this.playlist = [...this.playlist, activeSong];

      this.filteredSongs = this.filteredSongs.map((song: any) => {
        song.active = song.url === url;
        return song;
      });

      this.toolbarHidden = false;
    },

    setPrevSong() {
      if (this.playlistCurrent <= 0) return;
      this.activeSong = this.playlist[this.playlistCurrent - 1];
      this.updateTranspose();
      this.playlistCurrent = this.playlistCurrent - 1;
    },

    setNextSong() {
      if (this.playlist[this.playlistCurrent + 1]) {
        // next known
        this.activeSong = this.playlist[this.playlistCurrent + 1];
      } else {
        // next random
        const randomKey = Math.floor(Math.random() * this.filteredSongs.length);
        const randomSong = this.filteredSongs[randomKey];
        this.activeSong = randomSong;
        this.playlist = [...this.playlist, randomSong];
      }
      this.playlistCurrent = this.playlistCurrent + 1;
      this.updateTranspose();
    },

    setRandomSong() {
      const randomKey = Math.floor(Math.random() * this.filteredSongs.length);
      const randomSong = this.filteredSongs[randomKey];
      if (!randomSong) return;
      this.changeSong(randomSong.url);
    },

    setUser(user: any) {
      if (user) {
        this.user = {
          uid: user.uid,
          photoURL: user.photoURL,
          displayName: user.displayName,
          email: user.email,
        };

        dbGet(dbRef(db, 'users/' + this.user.uid)).then(snapshot => {
          const val = snapshot.val();
          const shows = (val && val.shows) || false;
          const comments = (val && val.comments) || false;

          if (shows) {
            console.log('Update shows from firebase:', shows);
            this.shows = shows;
          }

          if (comments) {
            console.log('Update comments from firebase:', comments);
            this.comments = comments;
          }

          const settings = (val && val.settings) || false;
          if (settings) {
            if (settings.webhookShow && this.webhookShow !== settings.webhookShow) {
              console.log('Update webhookShow from firebase:', settings);
              this.webhookShow = settings.webhookShow;
            }
          }
        });
      } else {
        this.user = false;
      }
    },

    setShow({ url, shows }: { url: string; shows: number }) {
      this.shows[url] = shows;

      if (this.user) {
        dbUpdate(dbRef(db, 'users/' + this.user.uid), { [`shows/${url}`]: shows });
        console.log('update remote shows');
      }
    },

    addShow(url: string) {
      const current = this.shows[url] || 0;
      this.shows[url] = current + 1;

      // webhookShow send
      const isWebhook = !!this.webhookShow;
      if (isWebhook) {
        // compute title, duplicate with SongItem
        let title = this.activeSong.title;
        if (this.activeSong.details.title) {
          title = this.activeSong.details.artist + ' - ' + this.activeSong.details.title;
        }
        title = title.trim(',');

        const obj = {
          title: title,
          url: this.activeSong.url,
        };

        const headers: Record<string, string> = {};

        // basic auth from url
        const urlObj = new URL(this.webhookShow);
        if (urlObj.username && urlObj.password) {
          headers.Authorization = 'Basic ' + btoa(`${urlObj.username}:${urlObj.password}`);
        }

        console.log('webhook: ', this.webhookShow, obj);
        $fetch(this.webhookShow, { method: 'POST', body: obj, headers }).catch((e: any) => {
          console.log('webhook error: ', e);
        });
      }

      if (this.user) {
        dbUpdate(dbRef(db, 'users/' + this.user.uid), { [`shows/${url}`]: this.shows[url] });
        console.log('update remote shows');
      }
    },

    addComment({ url, comment }: { url: string; comment: any }) {
      this.comments[url] = comment;

      if (this.user) {
        console.log('state.comments: ', this.comments);
        dbUpdate(dbRef(db, 'users/' + this.user.uid), { comments: this.comments });
        console.log('update remote comments');
      }
    },
  },

  persist: {
    key: 'vuex',
    pick: [
      'filter',
      'shows',
      'comments',
      'noSleep',
      'darkMode',
      'fontSize',
      'autoScrollSpeed',
      'instrument',
      'artistsSort',
      'readerMode',
      'showImages',
      'showBadges',
      'showShows',
      'showBeats',
      'webhookShow',
      'beatCustomInstruments',
      'queue',
    ],
  } as any,
});
