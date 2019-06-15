import createPersistedState from 'vuex-persistedstate';

export default ({ store }) => {
  createPersistedState({
    paths: ['filter', 'noSleep', 'fontSize', 'instrument', 'artistsSort']
  })(store);
};
