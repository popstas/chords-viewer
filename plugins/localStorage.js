import createPersistedState from "vuex-persistedstate";

export default ({store}) => {
  createPersistedState({
    paths: [
      "filter",
      "shows",
      "comments",
      "noSleep",
      "darkMode",
      "fontSize",
      "autoScrollSpeed",
      "instrument",
      "artistsSort",
      "readerMode",
      "showImages",
      "showBadges",
      "webhookShow",
      "beatCustomInstruments",
    ]
  })(store);
};
