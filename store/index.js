export const state = () => ({
  songs: [],
  title: 'chords-viewer',
});

export const mutations = {
  songs: (state, newValue) => {
    state.songs = newValue
  },
};

export const actions = {
};

export const strict = false;
