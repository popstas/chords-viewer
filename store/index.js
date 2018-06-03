import pjson from "~/package.json";
import dateformat from "dateformat";
import songs from "~/chords.json";

export const transposeMap = [
  ["Am", "A#m", "Hm", "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m"],
  ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"],
  ["A7", "A#7", "H7", "C7", "C#7", "D7", "D#7", "E7", "F7", "F#7", "G7", "G#7"],
  [
    "Am7",
    "A#m7",
    "Hm7",
    "Cm7",
    "C#m7",
    "Dm7",
    "D#m7",
    "Em7",
    "Fm7",
    "F#m7",
    "Gm7",
    "G#m7"
  ]
];

export const state = () => ({
  // data
  songs: songs,

  // constants
  name: pjson.name,
  version: pjson.version,
  description: pjson.description,
  homepage: pjson.homepage,

  // app state
  activeSong: {},

  // filters
  filter: {
    q: "",
    withChords: false,
    withTexts: false,
    sortByDate: false
  }
});

export const getters = {
  lastUpdated(state) {
    let date = Math.max.apply(
      Math,
      state.songs.map(song => new Date(song.created))
    );
    return dateformat(new Date(date), "dd.mm.yyyy");
  }
};

export const mutations = {
  songs: (state, newValue) => {
    state.songs = newValue;
  },
  activeSong: (state, newValue) => {
    state.activeSong = newValue;
  },

  // q, withChords, withTexts, sortByDate
  changeFilter(state, options) {
    console.log("mutation filter:", options);
    state.filter[options.name] = options.value;
  }
};

export const actions = {};

export const strict = true;
