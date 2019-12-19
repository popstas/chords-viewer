import pjson from '~/package.json';
import dateformat from 'dateformat';
import songs from '~/chords.json';
import Fuse from 'fuse.js';

export const transposeMap = [
  ['Am', 'A#m', 'Bm', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m'],
  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
  ['C+7', 'C#+7', 'D+7', 'D#+7', 'E+7', 'F+7', 'F#+7', 'G+7', 'G#+7', 'A+7', 'A#+7', 'B+7'],
  ['Csus2', 'C#sus2', 'Dsus2', 'D#sus2', 'Esus2', 'Fsus2', 'F#sus2', 'Gsus2', 'G#sus2', 'Asus2', 'A#sus2', 'Bsus2'],
  ['Csus2/A#', 'C#sus2/B', 'Dsus2/C', 'D#sus2/C#', 'Esus2/D', 'Fsus2/D#', 'F#sus2/E', 'Gsus2/F', 'G#sus2/F#', 'Absus2/Gb', 'A#sus2/Ab', 'Bsus2/A'],
  ['A5', 'A#5', 'B5', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5'],
  ['A7', 'A#7', 'B7', 'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7'],
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
  activeSong: { title: '' },
  playlist: [],
  playlistCurrent: -1,
  toolbarHidden: false,

  // settings
  fontSize: 1,
  autoScrollSpeed: 4,
  instrument: 'guitar',
  artistsSort: 'name',

  // filters
  filter: {
    q: '',
    withChords: -1,
    withTexts: -1,
    sortByDate: true,
    popular: -1
  }
});

export const getters = {
  lastUpdated(state) {
    let date = Math.max.apply(Math, state.songs.map(song => new Date(song.created)));
    return dateformat(new Date(date), 'dd.mm.yyyy');
  },

  activeSongTitle(state) {
    if (!state.activeSong.title) return '';
    let title = state.activeSong.title;
    if (state.activeSong.details) {
      title = state.activeSong.details.artist + ' - ' + state.activeSong.details.title;
    }
    title = title.trim(',');
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
  autoScrollSpeed(state, newValue) {
    state.autoScrollSpeed = newValue;
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
      let isArtist = q.match(/\^.*$/);
      let isGenre = q.match(/^жанр:.*$/);
      if (isLetter) {
        result = result.filter(song => song.title.toLowerCase().search(q) >= 0);
      } else if (isArtist) {
        result = result.filter(song => song.details && song.details.artist.toLowerCase().search(q) >= 0);
      } else if (isGenre) {
        let g = state.filter.q.replace('жанр: ', '');
        result = result.filter(song => song.genres && song.genres.includes(g));
        console.log('result: ', result);
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


    // data modify
    result = result.map(song => {
      song.popular = song.tags.indexOf('аккорды популярные') != -1;

      // song.genre
      let g = song.tags.map(tag => {
        if(tag.indexOf('жанр:') === 0) return tag.replace('жанр: ', '');
      });
      song.genres = g.filter((genre, pos, arr) => {
        return genre;
      });

      return song;
    });

    // filters

    if (state.filter.withChords === '1') {
      result = result.filter(song => song.details.chords);
    }

    if (state.filter.withChords === '0') {
      result = result.filter(song => !song.details.chords);
    }

    if (state.filter.withTexts === '1') {
      result = result.filter(song => song.text);
    }

    if (state.filter.withTexts === '0') {
      result = result.filter(song => !song.text);
    }

    if (state.filter.popular === '1') {
      result = result.filter(song => song.popular);
    }

    if (state.filter.popular === '0') {
      result = result.filter(song => !song.popular);
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
