<template>
  <div class="beat-player">
		<el-row class="beat" :gutter="20">
			<el-col :span="14" class="beat__left">
				<el-button
					@click="play"
				>{{ name || beat.name }}</el-button>
				<el-button @click="toggle">{{ stopped ? 'Play' : 'Stop' }}</el-button>
			</el-col>
			<el-col :span="4" class="beat__rever">
				<el-checkbox v-model="reverCurrent">rever</el-checkbox>
			</el-col>
			<el-col :span="6" class="beat__right">
				<el-slider v-model="bpmCurrent" :min="bpmMin" :max="bpmMax"></el-slider>
			</el-col>
		</el-row>
		<el-row v-if="pianoAllowed" class="piano" :gutter="20">
			<el-col :span="24" class="beat__left">
				<el-checkbox v-model="pianoCurrent">piano</el-checkbox>
					<el-radio-group  v-model="chordBeats" size="mini">
						<el-radio-button title="2" label="2">2</el-radio-button>
						<el-radio-button title="4" label="4">4</el-radio-button>
						<el-radio-button title="8" label="8">8</el-radio-button>
					</el-radio-group>
				</el-col>
		</el-row>
		<div v-if="error">{{ error }}</div>

  </div>
</template>

<style lang="scss">
.beat__left {
	padding-top: 7px;
}
.beat__rever {
	text-align: right;
	padding-top: 6px;
}
</style>

<script>
import debounce from "lodash/debounce";
import WebAudioFontPlayer from 'webaudiofont';
import MIDIFile from '../MIDIFile.js';

import beats from "~/assets/beats.json";
import "../assets/instruments/drums0.js";
import "../assets/instruments/piano0.js";
// import "../assets/instruments/piano1.js";

const bpmDefault = 100;
const chordNotesMap = {
	'E': [40, 44, 47],
	'E7': [40, 44, 47], // [40, 44, 47, 50],
	'Em': [40, 43, 47],
	'Em7': [40, 43, 47], // [40, 43, 47, 50],
	'C': [36, 40, 43],
	'Cm': [36, 39, 43],
	'Cmaj': [36, 40, 43], // [36, 40, 43, 47]
	'Cmaj7': [36, 40, 43], // [36, 40, 43, 47]
	'C#': [37, 41, 44],
	'D': [38, 42, 45],
	'Dm': [38, 41, 45],
	'Hm': [35, 38, 42],
	'Bm': [35, 38, 42],
	'H': [35, 39, 42], // [47, 51, 54],
	'B7': [35, 39, 42], // [47, 51, 54],
	'H7': [35, 39, 42], // [47, 51, 54],
	'G': [43, 47, 50],
	'Gm': [43, 46, 50],
	'G6': [43, 47, 50], // [43, 47, 50, 52],
	'G#': [44, 48, 51],
	'F': [41, 45, 48],
	'F#': [42, 46, 49],
	'A': [45, 49, 52],
	'Am': [45, 48, 52],
	'Am7': [45, 48, 52], // [45, 48, 52, 55],
	'A#': [46, 50, 53],
	// дальше не точно
	'D#m': [39, 42, 46],
	'C#m': [37, 40, 44],
	'F#m': [42, 45, 49],
	'G#m': [44, 47, 51],
	'A#m': [46, 49, 53],
	'D#': [51, 54, 58],
};
const instrDrumsMap = {
  33: '_drum_35_0_JCLive_sf2_file',
  35: '_drum_35_0_JCLive_sf2_file',
  36: '_drum_36_0_JCLive_sf2_file',
  37: '_drum_37_0_JCLive_sf2_file',
  38: '_drum_38_0_JCLive_sf2_file',
  39: '_drum_39_0_JCLive_sf2_file',
  40: '_drum_40_0_JCLive_sf2_file',
  41: '_drum_41_0_JCLive_sf2_file',
  42: '_drum_42_0_JCLive_sf2_file',
  43: '_drum_43_0_JCLive_sf2_file',
  44: '_drum_44_0_JCLive_sf2_file',
  45: '_drum_45_0_JCLive_sf2_file',
  46: '_drum_46_0_JCLive_sf2_file',
  47: '_drum_47_0_JCLive_sf2_file',
  48: '_drum_48_0_JCLive_sf2_file',
  49: '_drum_49_0_JCLive_sf2_file',
  50: '_drum_50_0_JCLive_sf2_file',
  51: '_drum_51_0_JCLive_sf2_file',
  52: '_drum_52_0_JCLive_sf2_file',
  53: '_drum_53_0_JCLive_sf2_file',
  54: '_drum_54_0_JCLive_sf2_file',
  55: '_drum_55_0_JCLive_sf2_file',
  56: '_drum_56_0_JCLive_sf2_file',
  57: '_drum_57_0_JCLive_sf2_file',
  58: '_drum_58_0_JCLive_sf2_file',
  59: '_drum_59_0_JCLive_sf2_file',
};

export default {
  props: ["beat", "name", "rever", "piano", "chords", "bpmForce"],
  data() {
    return {
			equalizer: null,
      player: null,
      audioContext: null,

			currentSongTime: 0,
      songStart: 0,
      nextStepTime: 0,
			nextPositionTime: 0,

			stopped: true,
			bpmCurrent: 0,
			reverCurrent: false,
			pianoAllowed: false,
			pianoCurrent: this.piano,
			chordBeats: 4,
			error: '',
			songDrums: null,
			songPiano: null,
    };
  },
  computed: {
		activeSong() {
      return this.$store.state.activeSong;
    },
		midiBpm() {
			// get bpm from beat.name, e.g. 'loop-2-tum-tum-120-bpm', with regex
			// if (this.pianoCurrent) return bpmDefault;
			const parsedBpm = this.beat.name.match(/(\d+)-bpm/);
			return parsedBpm && parseInt(parsedBpm[1]) || bpmDefault;
		},
		bpm() {
			return this.beat.bpm || this.midiBpm;
		},
		bpmMultiplier() {
			// console.log('this.midiBpm: ', this.midiBpm);
			// console.log('this.bpm: ', this.bpm);
			return this.midiBpm / this.bpmCurrent;
		},
		bpmMin() {
			const min = this.bpm * 0.8;
			return this.bpmForce ? Math.min(this.bpmForce, min) : min;
		},
		bpmMax() {
			const max = this.bpm * 1.2;
			return this.bpmForce ? Math.max(this.bpmForce, max) : max;
		},
		chordsList() {
			let chords = this.chords?.replace(/\(.*?\)/g, '').trim().split(' ') || [];
			if (chords.length === 2) {
				chords = [chords[0], chords[0], chords[1], chords[1]];
			}
			return chords;
		},
  },
	watch: {
		activeSong(val) {
			if (!val) this.stop();
		},
		pianoCurrent(val) {
			this.replay(this);
		},
		bpmCurrent(val) {
			this.replay(this);
		},
		bpmForce(val) {
			this.bpmCurrent = val;
		},
		reverCurrent(val) {
			// this.replay(this);
			if (!this.player) return;
			if (val) {
				this.equalizer = this.player.createChannel(this.audioContext);
				this.input = this.equalizer.input;
				const reverberator = this.player.createReverberator(this.audioContext);
				this.equalizer.output.connect(reverberator.input);
				reverberator.output.connect(this.audioContext.destination);
			}
			// simple
			else {
				this.input = this.audioContext.destination;
			}
		},
		chordBeats(val) {
			this.replay(this);
		},
	},
  methods: {
		toggle() {
			if (this.stopped) this.play();
			else this.stop();
		},
    play() {
			this.stop();
			this.error = '';
			this.songDrums = this.songInit();
			this.songPiano = this.songInit();

			const beat = beats.find(b => b.name === this.beat.name);
			if (beat) {
				this.player = new WebAudioFontPlayer();
				const midiArrayBuffer = this.base64ToArrayBuffer(beat.data);
				const midiFile = new MIDIFile(midiArrayBuffer);
				// console.log('midiFile: ', midiFile);
				this.songDrums.song = midiFile.parseSong();
				this.songDrums.isDrums = true;
			}

			if (this.pianoCurrent) this.songPiano.song = this.buildSongFromChords();

			if (!this.pianoCurrent && !this.songDrums.song) {
				if (!this.error) this.error = 'Cannot find beat.';
				console.log('song is empty, cancel play');
				return;
			}
			if (this.pianoCurrent && !this.songPiano.song) {
				if (!this.error) this.error = 'Cannot build song from chords.';
				console.log('song is empty, cancel play');
				return;
			}

			// console.log('this.songDrums: ', this.songDrums.song);
			// console.log('this.songPiano: ', this.songPiano.song);
      this.startLoad(this.songDrums.song || this.songPiano.song);
    },

		replay: debounce((self) => {
  		if (!self.stopped) self.play();
		}, 500),

		songInit() {
			return {
				song: null,
				isDrums: false,
				currentSongTime: 0,
				songStart: 0,
				nextStepTime: 0,
				nextPositionTime: 0,
			}
		},
		applyBpm(song) {
			song.duration = song.duration * this.bpmMultiplier;

			// const origNotes = [...song.tracks[0].notes];
			// console.log('origNotes: ', origNotes);
			const bpmNotes = song.tracks[0].notes.map(note => {
				note.when = note.when * this.bpmMultiplier;
				return note;
			});
			song.tracks[0].notes = bpmNotes;
			// console.log('bpmNotes: ', bpmNotes);

			return song;
		},


		stop() {
			if (!this.player) return;
			this.stopped = true;
			this.player.cancelQueue(this.audioContext);
		},

    startLoad(song) {
			const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContextFunc();
			this.player = new WebAudioFontPlayer();

			// with equalizer and reverberator
			if (this.reverCurrent) {
				this.equalizer = this.player.createChannel(this.audioContext);
				this.input = this.equalizer.input;
				const reverberator = this.player.createReverberator(this.audioContext);
				this.equalizer.output.connect(reverberator.input);
				reverberator.output.connect(this.audioContext.destination);
			}
			// simple
			else {
				this.input = this.audioContext.destination;
			}


			for (let i = 0; i < song.tracks.length; i++) {
				const nn = this.player.loader.findInstrument(song.tracks[i].program);
				const info = this.player.loader.instrumentInfo(nn);
				song.tracks[i].info = info;
				song.tracks[i].id = nn;
				this.player.loader.startLoad(this.audioContext, info.url, info.variable);
			}
			/* for (let i = 0; i < song.beats.length; i++) {
				const nn = this.player.loader.findDrum(song.beats[i].n);
				const info = this.player.loader.drumInfo(nn);
				song.beats[i].info = info;
				song.beats[i].id = nn;
				this.player.loader.startLoad(this.audioContext, info.url, info.variable);
			} */

      const onLoad = () => {
				// this.sendNotes(song, this.songStart, this.currentSongTime, this.currentSongTime + stepDuration, this.audioContext, this.input, this.player);
				setTimeout(() => {
					const duration = 0.5;
					// const vol = 1 / 7;

					// show all notes
					/* song.tracks[0].notes.map(note => {
						console.log('note: ', note.pitch);
					}); */

					// play uniqNotes with volume 0.001 for preload
					if (!this.pianoCurrent) {
						const uniqNotes = [...new Set(song.tracks[0].notes.map(note => note.pitch))];
						for (let i = 0; i < uniqNotes.length; i++) {
							const vol = 0.001;
							const instr = instrDrumsMap[uniqNotes[i]];
							this.player.loader.decodeAfterLoading(this.audioContext, instr); // https://github.com/surikov/webaudiofont/issues/23
							// this.player.queueWaveTable(this.audioContext, this.input, window[instr], 0, uniqNotes[i], duration, vol, []);
						}
					}
					else {
						this.player.loader.decodeAfterLoading(this.audioContext, song.tracks[0].info.variable); // https://github.com/surikov/webaudiofont/issues/23
					}
					
					// intro 4 beats (1st for preload)
					const pitch = 42;
					const instr = instrDrumsMap[pitch];
					const offset = 60000 / this.bpmCurrent;
					for (let i = 0; i < 5; i++) {
						setTimeout(() => {
							const vol = i == 0 ? 0.001 : 1 / 7;
							this.player.queueWaveTable(this.audioContext, this.input, window[instr], 0, pitch, duration, vol, []);
						}, offset*i);
					}

					setTimeout(() => {
						this.startPlay(song);
					}, offset * 5);
				}, 100);
      }
			this.player.loader.waitLoad(onLoad);
		},

    base64ToArrayBuffer(base64) {
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },

		buildSongFromChords() {
			const chords = this.chordsList;
			if (chords.length !== 4) {
				this.error = `Chords count should be 4, but ${chords.length} given.`
				return;
			}

			const bpm = this.midiBpm;

			const ticksPerBeat = 2;
			const repeats = 4; // for avoid loop issues

			const chordBeats = this.chordBeats; // 2 beats per chord
			// const ticks = chords.length * ticksPerBeat;
			const beatDuration = 60 / bpm;
			const tickDuration = beatDuration / ticksPerBeat;
			const totalBeats = chords.length * chordBeats;

			const song = {
				tracks: [{
					id: 0,
					program: 0,
					n: 0,
					volume: 1,
					info: {
						title: "Acoustic Grand Piano: Piano",
						url: "https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js",
						variable: "_tone_0000_JCLive_sf2_file",
						// variable: "_tone_0000_Aspirin_sf2_file", // piano1
					},
					notes: [],
				}],
				beats: [],
				duration: totalBeats * beatDuration * repeats,
			};

			const duration = 0.5;

			const songNotes = [];
			// build notes from chord for chordBeats
			for (let i = 0; i < chords.length; i++) {
				const chordNotes = chordNotesMap[chords[i]];
				if (!chordNotes) {
					this.error = `Chord ${chords[i]} not found.`
					// console.log('cannot find notes for chord: ', );
					return;
				}
				const notesPerChord = chordBeats * ticksPerBeat;
				for (let j = 0; j < notesPerChord; j++) {
					const pitch = chordNotes[j % chordNotes.length];
					songNotes.push(pitch);
				}
			}

			let offset = 0;
			for (let r = 0; r < repeats; r++) {
				for (let t = 0; t < songNotes.length; t++) {
					const pitch = songNotes[t];
					song.tracks[0].notes.push({
						when: offset * tickDuration,
						pitch,
						duration,
						slides: [],
					});
					offset++;
				}
			}

			return song;
		},

  	startPlay(song) {
			this.stopped = false;
			const stepDuration = 44 / 1000;

			for (let s of [this.songDrums, this.songPiano]) {
				if (!s.song) continue;
				s.songOrig = s.song;
				s.song = this.applyBpm(s.song);
				s.currentSongTime = 0;
				s.songStart = this.audioContext.currentTime;
				s.nextStepTime = this.audioContext.currentTime;
				this.tick(s, stepDuration);
			}
			// this.currentSongTime = 0;
			// this.songStart = this.audioContext.currentTime;
			// this.nextStepTime = this.audioContext.currentTime;
			// this.tick(song, stepDuration);
		},
    tick(song, stepDuration) {
			if (this.audioContext.currentTime > song.nextStepTime - stepDuration) {
				this.sendNotes(song.song, song.songStart, song.currentSongTime, song.currentSongTime + stepDuration, this.audioContext, this.input, this.player, song.isDrums);
				song.currentSongTime = song.currentSongTime + stepDuration;
				song.nextStepTime = song.nextStepTime + stepDuration;
				if (song.currentSongTime > song.song.duration) {
					console.log('song.currentSongTime: ', song.currentSongTime);
					// song.currentSongTime = song.currentSongTime - song.song.duration; // обнуление лучше высчитывания, не слышно стыка
					song.currentSongTime = 0
					this.sendNotes(song.song, song.songStart, 0, song.currentSongTime, this.audioContext, this.input, this.player, song.isDrums);
					song.songStart = song.songStart + song.song.duration;
				}
			}
			if (song.nextPositionTime < this.audioContext.currentTime) {
				// var o = document.getElementById('position');
				// o.value = 100 * this.currentSongTime / song.duration;
				// document.getElementById('tmr').innerHTML = '' + Math.round(100 * this.currentSongTime / song.duration) + '%';
				song.nextPositionTime = this.audioContext.currentTime + 3;
			}
			window.requestAnimationFrame(() => {
				if (!this.stopped) this.tick(song, stepDuration);
			});
		},
    sendNotes(song, songStart, start, end, audioContext, input, player, isDrums=false) {
			for (var t = 0; t < song.tracks.length; t++) {
				var track = song.tracks[t];
				for (var i = 0; i < track.notes.length; i++) {
					if (track.notes[i].when >= start && track.notes[i].when < end) {
						var when = songStart + track.notes[i].when;
						if (isNaN(when)){
							console.log('when is NaN: ');
							console.log('songStart: ', songStart);
							console.log('track.notes[i].when: ', track.notes[i].when);
							continue;
						}
						var duration = track.notes[i].duration;
						if (duration > 3) {
							duration = 3;
						}
						var instr = track.info.variable;

						const pitch = track.notes[i].pitch;
						if (isDrums) instr = instrDrumsMap[pitch] || track.info.variable;
						// console.log('instr: ', instr);
						// console.log('note: ', track.notes[i].pitch);
						// var v = track.volume / 7;
						var v = track.volume;
						player.queueWaveTable(audioContext, input, window[instr], when, track.notes[i].pitch, duration, v, track.notes[i].slides);
					}
				}
			}
			for (var b = 0; b < song.beats.length; b++) {
				var beat = song.beats[b];
				for (var i = 0; i < beat.notes.length; i++) {
					if (beat.notes[i].when >= start && beat.notes[i].when < end) {
						var when = songStart + beat.notes[i].when;
						var duration = 1.5;
						var instr = beat.info.variable;
						var v = beat.volume / 2;
						player.queueWaveTable(audioContext, input, window[instr], when, beat.n, duration, v);
					}
				}
			}
		}
  },
	mounted() {
		this.bpmCurrent = this.bpm;
		this.reverCurrent = this.rever;
		this.pianoAllowed = this.chordsList.length === 4;
	},
	beforeDestroy() {
		this.stop();
	},
};
</script>
