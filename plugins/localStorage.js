import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
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
      "showImages",
      "showBadges",
      "webhookShow"
    ]
  })(store);
};
