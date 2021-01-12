import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    paths: [
      "filter",
      "shows",
      "noSleep",
      "darkMode",
      "fontSize",
      "autoScrollSpeed",
      "instrument",
      "artistsSort",
      "showImages",
      "showBadges",
      "webhookShow"
    ]
  })(store);
};
