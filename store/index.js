import pjson from '~/package.json';
import dateformat from 'dateformat';
import songs from '~/chords.json';
import Fuse from 'fuse.js';

export const transposeMap = [
  ['Am', 'A#m', 'Hm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H'],
  ['A7', 'A#7', 'H7', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7'],
  ['Am7', 'A#m7', 'Hm7', 'Cm7', 'C#m7', 'Dm7', 'D#m7', 'Em7', 'Fm7', 'F#m7', 'Gm7', 'G#m7']
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
  activeSong: {},
  playlist: [],
  playlistCurrent: -1,
  toolbarHidden: false,

  // filters
  filter: {
    q: '',
    withChords: false,
    withTexts: false,
    sortByDate: false,
    popular: false
  }
});

export const getters = {
  lastUpdated(state) {
    let date = Math.max.apply(Math, state.songs.map(song => new Date(song.created)));
    return dateformat(new Date(date), 'dd.mm.yyyy');
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
  setFilteredSongs(state, newValue) {
    state.filteredSongs = newValue;
  },
  // q, withChords, withTexts, sortByDate
  changeFilter(state, options) {
    state.filter[options.name] = options.value;
  },
  setToolbarHidden(state, newValue) {
    state.toolbarHidden = newValue;
  },
  setNoSleep(state, newValue) {
    state.noSleep = newValue;
  }
};

export const actions = {
  filterSongs({ commit, state }, payload) {
    const q = state.filter.q.toLowerCase();
    let result = state.songs;

    if (q) {
      let isLetter = q.match(/\^.$/);
      if (isLetter) {
        result = result.filter(song => song.title.toLowerCase().search(q) >= 0);
      } else {
        let fuse = new Fuse(result, {
          keys: [
            {
              name: 'title',
              weight: 0.7
            },
            {
              name: 'text',
              weight: 0.3
            }
          ]
        });
        result = fuse.search(q);
        /* // without fuse
        result = result.filter(song => {
          return (
            song.title.toLowerCase().search(q) >= 0 ||
            (!isLetter && song.text && song.text.toLowerCase().search(q) >= 0)
          );
        }); */
      }
    }

    if (state.filter.withChords) {
      result = result.filter(song => song.details.chords);
    }

    if (state.filter.withTexts) {
      result = result.filter(song => song.text);
    }

    if (state.filter.popular) {
      result = result.filter(song => song.tags.indexOf('аккорды популярные') != -1);
    }

    if (state.filter.sortByDate) {
      result = result.slice().sort((a, b) => new Date(b.created) - new Date(a.created));
    }

    commit('setFilteredSongs', result);
  },

  setPrevSong({ commit, state }, payload) {
    if (state.playlistCurrent <= 0) return;
    commit('activeSong', state.playlist[state.playlistCurrent - 1]);
    commit('playlistCurrent', state.playlistCurrent - 1);
  },

  setNextSong({ commit, state }, payload) {
    if (state.playlist[state.playlistCurrent + 1]) {
      // next known
      commit('activeSong', state.playlist[state.playlistCurrent + 1]);
    } else {
      // next random
      const randomKey = Math.floor(Math.random() * state.filteredSongs.length);
      const randomSong = state.filteredSongs[randomKey];
      commit('activeSong', randomSong);
      commit('playlist', [...state.playlist, randomSong]);
    }
    commit('playlistCurrent', state.playlistCurrent + 1);
  }
};

export const strict = true;
