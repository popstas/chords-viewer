<template>
  <div class="beat-player-all">
		<el-row class="beat" :gutter="20">
			<el-col :span="24" class="">
				<el-slider v-model="bpmCurrent" :min="bpm * 0.5" :max="bpm * 1.5"></el-slider>
			</el-col>
		</el-row>
		<el-row class="beat" :gutter="20">
			<el-col :span="24" class="beat__right">
				<div v-for="beat in beats" :key="beat.name">
					<BeatPlayer
						:beat="beat" :bpmForce="bpmCurrent"
						:chords="activeChords" :rever="true"
					></BeatPlayer>
				</div>
			</el-col>
		</el-row>
  </div>
</template>

<style lang="scss">
</style>

<script>
import beats from "~/assets/beats.json";
import BeatPlayer from "~/components/BeatPlayer";

export default {
	components: { BeatPlayer },
  props: ["bpm", "chords"],
  data() {
    return {
			bpmCurrent: 0,
    };
  },
  computed: {
		activeSong() {
      return this.$store.state.activeSong;
    },
		activeChords() {
			return this.activeSong?.details?.chords || "";
		},
		beats() {
			// return beats sorted by beat.name, natural sort
			return beats.map(beat => {
				beat.nameNormalized = beat.name.replace(/(\d+)/g, (match, p1) => {
					return p1.padStart(3, '0');
				});
				return beat;
			})
			.sort((a, b) => {
				if (a.nameNormalized < b.nameNormalized) return -1;
				if (a.nameNormalized > b.nameNormalized) return 1;
				return 0;
			})
		},
  },
	watch: {
	},
  methods: {
  },
	mounted() {
		this.bpmCurrent = this.bpm;
	},
	beforeDestroy() {
	},
};
</script>
