<template>
  <button
    v-if="show"
    class="verse-nav"
    title="К следующему куплету"
    @click="scrollToNextHr"
  >
    <icon name="angles-down" scale="2"></icon>
  </button>
</template>

<style lang="scss">
.verse-nav {
  position: fixed;
  right: 16px;
  bottom: 90px;
  z-index: 3;
  width: 75px;
  height: 75px;
  padding: 0;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color);
  background: var(--bg-hover);
  opacity: 0.45;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;

  &:hover,
  &:active {
    opacity: 0.8;
  }
}
</style>

<script>

// верстка переключается на несколько колонок с min-width: 1200px (см. SongItem.scss),
// поэтому "мобильный или 1 колонка" = ширина вьюпорта < 1200px
const ONE_COLUMN_MAX_WIDTH = 1200;

// отступ сверху, чтобы строка после <hr> не пряталась под floating-аккордами
const TOP_OFFSET = 60;

// длительность анимации прокрутки, мс — быстро, но плавно
const SCROLL_DURATION = 450;

export default {
  data() {
    return {
      isNarrow: true,
      scrollRaf: null,
    };
  },

  computed: {
    show() {
      return this.isNarrow && !!this.$store.state.activeSong.url && !!this.$store.state.activeSong.text;
    },
  },

  methods: {
    updateIsNarrow() {
      this.isNarrow = window.innerWidth < ONE_COLUMN_MAX_WIDTH;
    },

    isMobile() {
      return screen.width <= 600;
    },

    // на мобильном скроллится виртуальный список, на десктопе — окно
    scrollContainer() {
      if (this.isMobile()) return document.querySelector(".vue-recycle-scroller");
      return null;
    },

    // виртуальный список (DynamicScroller) держит «призрачную» переиспользуемую
    // копию активной песни вне экрана — берём ту, что реально видна во вьюпорте
    activeContent() {
      const candidates = Array.from(
        document.querySelectorAll(".song-item.active .song-item__content")
      );
      if (candidates.length <= 1) return candidates[0] || null;
      const visibleHeight = el => {
        const r = el.getBoundingClientRect();
        return Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      };
      return candidates.sort((a, b) => visibleHeight(b) - visibleHeight(a))[0];
    },

    // нижняя граница перекрытой сверху области: залипающий хедер приложения
    // (.el-header, непрозрачный) и плавающие аккорды (.chords). Всё, что выше
    // неё, визуально скрыто — туда и прячем <hr>.
    coverBottom() {
      let bottom = 0;
      for (const el of document.querySelectorAll(".el-header, .chords")) {
        const s = getComputedStyle(el);
        if (s.position === "fixed" || s.position === "sticky") {
          bottom = Math.max(bottom, el.getBoundingClientRect().bottom);
        }
      }
      return bottom || TOP_OFFSET;
    },

    scrollToNextHr() {
      const content = this.activeContent();
      if (!content) return;
      const hrs = Array.from(content.querySelectorAll("hr"));
      const container = this.scrollContainer();
      const cover = this.coverBottom();

      // следующий <hr> — первый, чей верх ниже перекрытой сверху области
      const next = hrs.find(hr => hr.getBoundingClientRect().top > cover + 4);

      let delta;
      if (next) {
        // прячем сам <hr> под хедер/аккорды, а первую строку следующего
        // куплета ставим сразу под перекрытой областью
        const wrapper = next.closest(".song-item__line_text") || next;
        const after = wrapper.nextElementSibling;
        const anchorTop = after
          ? after.getBoundingClientRect().top
          : next.getBoundingClientRect().bottom;
        delta = anchorTop - cover;
      } else {
        // куплетов больше нет — мотаем в конец песни
        delta = content.getBoundingClientRect().bottom - window.innerHeight;
        if (delta <= 0) return;
      }

      this.animateScrollBy(container, delta);
    },

    // плавная прокрутка через rAF: нативный smooth у контейнера виртуального
    // списка часто срабатывает мгновенным прыжком, поэтому анимируем сами
    animateScrollBy(container, delta) {
      if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);

      const getPos = () => (container ? container.scrollTop : window.scrollY);
      const setPos = pos =>
        container ? (container.scrollTop = pos) : window.scrollTo(0, pos);
      // easeInOutQuad — быстрый разгон/торможение, мягкие края
      const ease = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

      const start = getPos();
      const startTime = performance.now();

      const step = now => {
        const t = Math.min(1, (now - startTime) / SCROLL_DURATION);
        setPos(start + delta * ease(t));
        this.scrollRaf = t < 1 ? requestAnimationFrame(step) : null;
      };
      this.scrollRaf = requestAnimationFrame(step);
    },
  },

  mounted() {
    this.updateIsNarrow();
    window.addEventListener("resize", this.updateIsNarrow);
  },

  unmounted() {
    window.removeEventListener("resize", this.updateIsNarrow);
    if (this.scrollRaf) cancelAnimationFrame(this.scrollRaf);
  },
};
</script>
