import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    paths: [
      "filter",
      "shows",
      "noSleep",
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
