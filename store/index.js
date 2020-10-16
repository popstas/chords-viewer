import pjson from "~/package.json";
import dateformat from "dateformat";
import songs from "~/chords.json";
import Fuse from "fuse.js";
import firebase from "firebase";
import debounce from "lodash/debounce";

export const transposeMap = [
  ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
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
  activeSong: { title: "" },
  playlist: [],
  playlistCurrent: -1,
  toolbarHidden: false,
  shows: {},
  user: false,

  // settings
  fontSize: 1,
  autoScrollSpeed: 4,
  instrument: "guitar",
  artistsSort: "name",
  showImages: false,
  showBadges: false,

  // filters
  filter: {
    q: "",
    withChords: -1,
    withTexts: -1,
    sortByDate: true,
    sortByShows: false,
    popular: -1
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
  }
};

export const mutations = {
  songs(state, newValue) {
    state.songs = newValue;
  },
  activeSong(state, newValue) {
    state.activeSong = newValue;
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
  showImages(state, newValue) {
    state.showImages = newValue;
  },
  showBadges(state, newValue) {
    state.showBadges = newValue;
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
  setNoSleep(state, newValue) {
    state.noSleep = newValue;
  },
  addShow(state, url) {
    const current = state.shows[url] || 0;
    state.shows[url] = current + 1;
    console.log('addShow: ', current + 1);
  },
  setShow(state, options) {
    console.log('setShow: ', options);
    state.shows[options.url] = options.shows;
  },
  setShows(state, newValue) {
    state.shows = newValue;
  },
  setUser(state, newValue) {
    state.user = newValue;
  }
};

const debouncedFilterSongs = debounce(dispatch => {
  dispatch("filterSongs");
}, 500);

export const actions = {
  changeFilter({ commit, dispatch }, options) {
    // console.log('options: ', options);
    commit("changeFilter", options);
    debouncedFilterSongs(dispatch);

  },

  async filterSongs({ commit, state }) {
    // console.log("FilterSongs");

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
          ... { webhookShow }
        };

        db.update({ settings });
      }

      return;
    }

    const q = state.filter.q.toLowerCase();
    let result = state.songs;

    // data modify
    result = result.map(song => {
      song.popular = song.tags.indexOf("аккорды популярные") != -1;

      // song.genre
      let g = song.tags.map(tag => {
        if (tag.indexOf("жанр:") === 0) return tag.replace("жанр: ", "");
      });
      song.genres = g.filter((genre, pos, arr) => {
        return genre;
      });

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
        let fuse = new Fuse(result, {
          minMatchCharLength: 2,
          keys: [
            {
              name: "title",
              weight: 0.7
            },
            {
              name: "text",
              weight: 0.3
            }
          ]
        });
        result = fuse.search(q).map(r => r.item);
        /* // without fuse
        result = result.filter(song => {
          return (
            song.title.toLowerCase().search(q) >= 0 ||
            (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
          );
        }); */
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

    if (state.filter.popular === "1") {
      result = result.filter(song => song.popular);
    }

    if (state.filter.popular === "0") {
      result = result.filter(song => !song.popular);
    }

    if (state.filter.sortByDate) {
      result = result
        .slice()
        .sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    if (state.filter.sortByShows) {
      result = result.slice().sort((a, b) => {
        const aSafe = a.url.replace(/[\/\.]/g, '_');
        const bSafe = b.url.replace(/[\/\.]/g, '_');
        const aShows = state.shows[aSafe] || 0;
        const bShows = state.shows[bSafe] || 0;
        return bShows - aShows || new Date(b.created) - new Date(a.created);
      });
    }

    commit("setFilteredSongs", result);
  },

  setPrevSong({ commit, state }, payload) {
    if (state.playlistCurrent <= 0) return;
    commit("activeSong", state.playlist[state.playlistCurrent - 1]);
    commit("playlistCurrent", state.playlistCurrent - 1);
  },

  setNextSong({ commit, state }, payload) {
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
  },

  setUser({ commit, state }, user) {
    if(user) {
      commit("setUser", {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
        email: user.email,
        uid: user.uid
      });

      firebase
        .database()
        .ref("users/" + state.user.uid)
        .once("value")
        .then(snapshot => {
          const shows = (snapshot.val() && snapshot.val().shows) || false;
          if (shows) {
            console.log('Update shows from firebase:', shows);
            commit("setShows", shows);
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

  addShow({ commit, state }, url) {
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
          shows: state.shows
        });
      console.log('update remote shows');
    }
  }
};

export const strict = true;
