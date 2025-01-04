import pjson from "~/package.json";
import dateformat from "dateformat";
import songs from "~/chords.json";
import Fuse from "fuse.js";
import firebase from "firebase";
import debounce from "lodash/debounce";

export const transposeMap = [
  ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  ['Cmaj7', 'C#maj7', 'Dmaj7', 'D#maj7', 'Emaj7', 'Fmaj7', 'F#maj7', 'Gmaj7', 'G#maj7', 'Amaj7', 'A#maj7', 'Bmaj7'],
  ['C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6'],
  ['C+7', 'C#+7', 'D+7', 'D#+7', 'E+7', 'F+7', 'F#+7', 'G+7', 'G#+7', 'A+7', 'A#+7', 'B+7'],
  ['Csus2', 'C#sus2', 'Dsus2', 'D#sus2', 'Esus2', 'Fsus2', 'F#sus2', 'Gsus2', 'G#sus2', 'Asus2', 'A#sus2', 'Bsus2'],
  ['Csus4', 'C#sus4', 'Dsus4', 'D#sus4', 'Esus4', 'Fsus4', 'F#sus4', 'Gsus4', 'G#sus4', 'Asus4', 'A#sus4', 'Bsus4'],
  ['Csus2/A#', 'C#sus2/B', 'Dsus2/C', 'D#sus2/C#', 'Esus2/D', 'Fsus2/D#', 'F#sus2/E', 'Gsus2/F', 'G#sus2/F#', 'Absus2/Gb', 'A#sus2/Ab', 'Bsus2/A'],
  ['Cm/A#', 'C#m/B', 'Dm/C', 'D#m/C#', 'Em/D', 'Fm/D#', 'F#m/E', 'Gm/F', 'G#m/F#', 'Abm/Gb', 'A#m/G#', 'Bm/A'],
  ['A5', 'A#5', 'B5', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'],
  ['A7', 'A#7', 'B7', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7'],
  ['Am6', 'A#m6', 'Bm6', 'Cm6', 'C#m6', 'Dm6', 'D#m6', 'Em6', 'Fm6', 'F#m6', 'Gm6', 'G#m6'],
  ['Am7', 'A#m7', 'Bm7', 'Cm7', 'C#m7', 'Dm7', 'D#m7', 'Em7', 'Fm7', 'F#m7', 'Gm7', 'G#m7'],
  ['Am7-5', 'A#m7-5', 'Bm7-5', 'Cm7-5', 'C#m7-5', 'Dm7-5', 'D#m7-5', 'Em7-5', 'Fm7-5', 'F#m7-5', 'Gm7-5', 'G#m7-5']
];

export const chordNotesMap = {
  'E': [40, 44, 47],
  'E5': [40, 44, 47], // [40, 47],
  'E7': [40, 44, 47], // [40, 44, 47, 50],
  'Em': [40, 43, 47],
  'Em7': [40, 43, 47], // [40, 43, 47, 50],
  'C': [48, 52, 55], // [36, 40, 43]
  'C5': [36, 40, 43], // [36, 43],
  'C#7': [37, 41, 44], // [37, 41, 44, 47],
  'Cm': [36, 39, 43],
  'C#m': [37, 40, 44],
  'Cmaj': [36, 40, 43], // [36, 40, 43, 47]
  'Cmaj7': [36, 40, 43], // [36, 40, 43, 47]
  'C#': [37, 41, 44],
  'D': [38, 42, 45],
  'D7': [38, 42, 45], // [38, 42, 45, 48]
  'Dsus2': [38, 42, 45],
  'D#': [39, 43, 46],
  'D5': [38, 42, 45], // [38, 45]
  'Dm': [50, 53, 57], // [38, 41, 45],
  'Dm7': [50, 53, 57], // [50, 53, 57, 60],
  'D#m': [39, 42, 46],
  'Hm': [35, 38, 42],
  'Bm': [35, 38, 42],
  'H': [35, 39, 42], // [47, 51, 54],
  'B': [35, 39, 42], // [47, 51, 54],
  'H5': [35, 39, 42], // [35, 42],
  'B5': [35, 39, 42], // [35, 42],
  'B7': [35, 39, 42], // [47, 51, 54],
  'H7': [35, 39, 42], // [47, 51, 54],
  'G': [43, 47, 50],
  'G5': [43, 47, 50], // [43, 50],
  'Gm': [43, 46, 50],
  'G6': [43, 47, 50], // [43, 47, 50, 52],
  'G#': [44, 48, 51],
  'G#7': [44, 48, 51], // [44, 48, 51, 54]
  'F': [41, 45, 48],
  'Fm': [41, 44, 48],
  'F5': [41, 45, 48], // [41, 48],
  'F#': [42, 46, 49],
  'A': [45, 49, 52],
  'A7': [45, 49, 52], // [45, 49, 52, 55]
  'A5': [45, 49, 52], // [45, 52],
  'Am': [45, 48, 52],
  'Am7': [45, 48, 52], // [45, 48, 52, 55],
  'A#': [46, 50, 53],
  // дальше не точно
  'F#m': [42, 45, 49],
  'G#m': [44, 47, 51],
  'A#m': [46, 49, 53],
};

export const state = () => ({
  // data
  songs: songs,
  filteredSongs: [],

  // constants
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  homepage: pjson.homepage,

  // app state
  activeSong: {title: ""},
  transposeLevel: 0,
  defaultTransposeLevel: 0,
  scroller: false,
  autoscroll: false,
  playlist: [],
  playlistCurrent: -1,
  toolbarHidden: false,
  shows: {},
  comments: {},
  user: false,
  lastOffset: 0,
  beatFirstPlay: true,
  beatCustomInstruments: false,

  // settings
  fontSize: 2,
  autoScrollSpeed: 4,
  instrument: "guitar",
  artistsSort: "name",
  readerMode: false,
  showSize: true,
  showImages: false,
  showBadges: false,
  showShows: true,
  showBeats: true,
  noSleep: false,
  darkMode: undefined,

  // filters
  filter: {
    q: "",
    withChords: -1,
    withTexts: -1,
    beats: -1,
    sortByDate: true,
    sortByShows: false,
    comments: -1,
  },

  webhookShow: ''
});

export const getters = {
  lastUpdated(state) {
    let date = Math.max.apply(
      Math,
      state.songs.map(song => new Date(song.created))
    );
    return dateformat(new Date(date), "dd.mm.yyyy");
  },

  activeSongTitle(state) {
    if (!state.activeSong.title) return "";
    let title = state.activeSong.title;
    if (state.activeSong.details) {
      title =
        state.activeSong.details.artist +
        " - " +
        state.activeSong.details.title;
    }
    title = title.trim(",");
    return title;
  },

  activeSongNum(state) {
    if (!state.activeSong.url) return -1;
    return state.songs.findIndex(song => song.url === state.activeSong.url);
  },

  replacedChord() {
    return (chord) => chord
      .replace(/H(\s)/, /B$1/)
      .replace(/^H$/, "B")
      .replace(/^H7$/, "B7")
      .replace("Hm", "Bm")
      .replace("m#", "#m")
      .replace("Ab", "G#")
      .replace("Bb", "A#")
      .replace("Cb", "B#")
      .replace("Db", "C#")
      .replace("Eb", "D#")
      .replace("Fb", "E#")
      .replace("Gb", "F#")
      .replace(/[()]/g, '');
  },
  isKnownChord(state, getters) {
    return (chord) => {
      return transposeMap.find(chain => chain.indexOf(getters.replacedChord(chord)) !== -1) || false;
    };
  },
  transposeChord(state, getters) {
    return (chord, level) => {
      chord = getters.replacedChord(chord);
      if (!chord) return "";

      if (!chord || level === 0)
        return chord;

      // find chord's chain
      let chain = transposeMap.find(chain => chain.indexOf(chord) !== -1);
      if (!chain) {
        return chord;
      }

      // iterate over chain at level
      let currentIndex = chain.indexOf(chord);
      for (let i = 0; i < Math.abs(level); i++) {
        if (level > 0) {
          currentIndex =
            currentIndex + 1 >= chain.length ? 0 : currentIndex + 1;
        } else {
          currentIndex =
            currentIndex - 1 < 0 ? chain.length - 1 : currentIndex - 1;
        }
      }
      return chain[currentIndex];
    }
  },
};

export const mutations = {
  songs(state, newValue) {
    state.songs = newValue;
  },
  activeSong(state, newValue) {
    state.activeSong = newValue;
  },
  transposeLevel(state, newValue) {
    state.transposeLevel = newValue;
  },
  defaultTransposeLevel(state, newValue) {
    state.defaultTransposeLevel = newValue;
  },
  scroller(state, newValue) {
    state.scroller = newValue;
  },
  playlist(state, newValue) {
    state.playlist = newValue;
  },
  playlistCurrent(state, newValue) {
    state.playlistCurrent = newValue;
  },
  fontSize(state, newValue) {
    state.fontSize = newValue;
  },
  instrument(state, newValue) {
    state.instrument = newValue;
  },
  artistsSort(state, newValue) {
    state.artistsSort = newValue;
  },
  readerMode(state, newValue) {
    state.readerMode = newValue;
  },
  showSize(state, newValue) {
    state.showSize = newValue;
  },
  showImages(state, newValue) {
    state.showImages = newValue;
  },
  showBadges(state, newValue) {
    state.showBadges = newValue;
  },
  showShows(state, newValue) {
    state.showShows = newValue;
  },
  showBeats(state, newValue) {
    state.showBeats = newValue;
  },
  autoscroll(state, newValue) {
    state.autoscroll = newValue;
  },
  autoScrollSpeed(state, newValue) {
    state.autoScrollSpeed = newValue;
  },
  webhookShow(state, newValue) {
    state.webhookShow = newValue;
  },
  setFilteredSongs(state, newValue) {
    state.filteredSongs = newValue;
  },
  // q, withChords, withTexts, sortByDate, sortByShows
  changeFilter(state, options) {
    state.filter[options.name] = options.value;
  },
  setToolbarHidden(state, newValue) {
    state.toolbarHidden = newValue;
  },
  noSleep(state, newValue) {
    state.noSleep = newValue;
  },
  darkMode(state, newValue) {
    state.darkMode = newValue;
  },
  addShow(state, url) {
    const current = state.shows[url] || 0;
    state.shows[url] = current + 1;
    // console.log('addShow: ', current + 1);
  },
  setShow(state, params) {
    // console.log('setShow: ', params);
    state.shows[params.url] = params.shows;
  },
  setShows(state, newValue) {
    state.shows = newValue;
  },
  setComment(state, params) {
    // console.log('setComment: ', params);
    state.comments[params.url] = params.comment;
  },
  setComments(state, newValue) {
    state.comments = newValue;
  },
  setUser(state, newValue) {
    state.user = newValue;
  },
  lastOffset(state, newValue) {
    state.lastOffset = newValue;
  },
  beatFirstPlay(state, newValue) {
    state.beatFirstPlay = newValue;
  },
  beatCustomInstruments(state, newValue) {
    state.beatCustomInstruments = newValue;
  },
};

const debouncedFilterSongs = debounce(dispatch => {
  dispatch("filterSongs");
}, 100);

let isFirstFilter = true;
const startTime = Date.now();

export const actions = {
  changeFilter({commit, dispatch, state}, options) {
    // console.log('changeFilter: ', options);
    commit("changeFilter", options);

    if (isFirstFilter) {
      dispatch("filterSongs");
      isFirstFilter = false;
    } else {
      const uptime = Date.now() - startTime;
      if (uptime < 2000) return; // fix double filter on start

      // loading placeholder if all songs filter
      if (state.filter.q === '') {
        commit("setFilteredSongs", [{
          title: 'Loading...',
          url: 'loading',
          text: 'loading',
          created: '',
          details: {
            artist: 'Songs',
            title: 'Loading...',
          }
        }]);
      }

      debouncedFilterSongs(dispatch);
      // dispatch("filterSongs");
    }
  },

  async filterSongs({commit, state}) {
    // webhookShow
    const webhookCommand = state.filter.q.match(/^webhookShow=(.*)$/);
    if (webhookCommand) {
      const webhookShow = webhookCommand[1];
      console.log('set webhookShow: ', webhookShow);
      commit('webhookShow', webhookShow);

      // store to firebase
      if (state.user) {
        const db = firebase.database().ref("users/" + state.user.uid);
        const snapshot = await db.once("value");
        const settings = {
          ...snapshot.val().settings || {},
          ...{webhookShow}
        };

        db.update({settings});
      }

      return;
    }

    const q = state.filter.q.toLowerCase();
    let result = state.songs;

    // data modify
    result = result.map(song => {
      // song.genre
      let g = song.tags.map(tag => {
        if (tag.indexOf("жанр:") === 0) return tag.replace("жанр: ", "");
      });
      song.genres = g.filter(Boolean);

      return song;
    });

    if (q) {
      let isLetter = q.match(/\^.$/);
      let isArtist = q.match(/\^.*$/);
      let isGenre = q.match(/^жанр:.*$/);
      if (isLetter) {
        result = result.filter(song => song.title.toLowerCase().search(q) >= 0);
      } else if (isArtist) {
        result = result.filter(
          song =>
            song.details && song.details.artist.toLowerCase().search(q) >= 0
        );
      } else if (isGenre) {
        let g = state.filter.q.replace("жанр: ", "");
        result = result.filter(song => song.genres && song.genres.includes(g));
      } else {
        const isFuse = false;

        if (isFuse) {
          let fuse = new Fuse(result, {
            minMatchCharLength: 2,
            keys: [
              {
                name: "title",
                weight: 0.7
              },
              {
                name: "text",
                weight: 0.5
              }
            ]
          });
          result = fuse.search(q).map(r => r.item);
        }

        // without fuse
        else {
          result = result.filter(song => {
            return (
              song.title.toLowerCase().search(q) >= 0 ||
              (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
            );
          });
        }
      }
    }

    // filters

    if (state.filter.withChords === "1") {
      result = result.filter(song => song.details.chords);
    }

    if (state.filter.withChords === "0") {
      result = result.filter(song => !song.details.chords);
    }

    if (state.filter.withTexts === "1") {
      result = result.filter(song => song.text);
    }

    if (state.filter.withTexts === "0") {
      result = result.filter(song => !song.text);
    }


    if (state.filter.comments === "1") {
      result = result.filter(song => {
        const safeUrl = song.url.replace(/[\/.]/g, '_');
        return !!state.comments[safeUrl]
      });
    }
    if (state.filter.comments === "0") {
      result = result.filter(song => {
        const safeUrl = song.url.replace(/[\/.]/g, '_');
        return !state.comments[safeUrl]
      });
    }

    if (state.filter.beats === "1") {
      result = result.filter(song => !!song.beat?.name);
    }

    if (state.filter.sortByDate) {
      result = result
        .slice()
        .sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    if (state.filter.sortByShows) {
      result = result.slice().sort((a, b) => {
        const aSafe = a.url.replace(/[\/.]/g, '_');
        const bSafe = b.url.replace(/[\/.]/g, '_');
        const aShows = state.shows[aSafe] || 0;
        const bShows = state.shows[bSafe] || 0;
        return bShows - aShows || new Date(b.created) - new Date(a.created);
      });
    }

    commit("setFilteredSongs", result);
  },

  updateTranspose({commit, state}) {
    const songTranspose = state.activeSong.title?.match(
      /\((капо|кап|capo|cap)\.? (\d+)\)/
    );
    const transpose = songTranspose ? songTranspose[2] * -1 : 0;
    commit("defaultTransposeLevel", transpose);
    commit("transposeLevel", transpose);
  },

  changeSong({commit, state, dispatch}, url) {
    let activeSong = state.songs.find(song => song.url === url) || {};
    if (state.activeSong.url === url) return;


    commit("activeSong", activeSong);
    dispatch("updateTranspose");
    commit("playlistCurrent", state.playlistCurrent + 1);
    commit("playlist", [...state.playlist, activeSong]);

    commit("setFilteredSongs", state.filteredSongs.map(song => {
      song.active = song.url === url;
      return song;
    }));

    commit("setToolbarHidden", false);
  },

  setPrevSong({commit, state, dispatch}) {
    if (state.playlistCurrent <= 0) return;
    commit("activeSong", state.playlist[state.playlistCurrent - 1]);
    dispatch("updateTranspose");
    commit("playlistCurrent", state.playlistCurrent - 1);
  },

  setNextSong({commit, state, dispatch}) {
    if (state.playlist[state.playlistCurrent + 1]) {
      // next known
      commit("activeSong", state.playlist[state.playlistCurrent + 1]);
    } else {
      // next random
      const randomKey = Math.floor(Math.random() * state.filteredSongs.length);
      const randomSong = state.filteredSongs[randomKey];
      commit("activeSong", randomSong);
      commit("playlist", [...state.playlist, randomSong]);
    }
    commit("playlistCurrent", state.playlistCurrent + 1);
    dispatch("updateTranspose");
  },

  setUser({commit, state}, user) {
    if (user) {
      commit("setUser", {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
      });

      firebase
        .database()
        .ref("users/" + state.user.uid)
        .once("value")
        .then(snapshot => {
          const shows = (snapshot.val() && snapshot.val().shows) || false;
          const comments = (snapshot.val() && snapshot.val().comments) || false;

          if (shows) {
            console.log('Update shows from firebase:', shows);
            commit("setShows", shows);
          }

          if (comments) {
            console.log('Update comments from firebase:', comments);
            commit("setComments", comments);
          }

          const settings = (snapshot.val() && snapshot.val().settings) || false;
          if (settings) {
            // console.log('Update settings from firebase:', settings);
            if (settings.webhookShow && state.webhookShow !== settings.webhookShow) {
              console.log('Update webhookShow from firebase:', settings);
              commit('webhookShow', settings.webhookShow);
            }
          }
        });
    } else {
      commit("setUser", false);
    }
  },

  setShow({commit, state}, {url, shows}) {
    commit('setShow', {url, shows});

    if (state.user) {
      firebase
        .database()
        .ref("users/" + state.user.uid)
        .update({
          [`shows/${url}`]: shows
        });
      console.log('update remote shows');
    }
  },

  addShow({commit, state}, url) {
    commit("addShow", url);

    // webhookShow send
    const isWebhook = !!state.webhookShow;
    if (isWebhook) {
      // compute title, duplicate with SongItem
      let title = state.activeSong.title;
      if (state.activeSong.details.title) {
        title = state.activeSong.details.artist + " - " + state.activeSong.details.title;
      }
      title = title.trim(",");

      const obj = {
        title: title,
        url: state.activeSong.url
      }

      const opts = {};

      // basic auth from url
      const urlObj = new URL(state.webhookShow);
      if (urlObj.username && urlObj.password) {
        opts.auth = {
          username: urlObj.username,
          password: urlObj.password,
        }
      }

      console.log('webhook: ', state.webhookShow, obj);
      this.$axios.$post(state.webhookShow, obj, opts);
    }

    if (state.user) {
      firebase
        .database()
        .ref("users/" + state.user.uid)
        .update({
          [`shows/${url}`]: state.shows[url]
        });
      console.log('update remote shows');
    }
  },

  addComment({commit, state}, {url, comment}) {
    commit("setComment", {url, comment});

    if (state.user) {
      console.log('state.comments: ', state.comments);
      firebase
        .database()
        .ref("users/" + state.user.uid)
        .update({
          comments: state.comments
        });
      console.log('update remote comments');
    }
  },
};

export const strict = true;
