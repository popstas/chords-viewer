<template>
  <div
		class="beat-player"
		v-shortkey="{a:['a'], aRus: ['ф'], b:['b'], bRus: ['и'], c:['c'], cRus: ['с'], d:['d'], dRus: ['в'], pgUp: ['pageup'], pgDn: ['pagedown']}"
		@shortkey="shortkey"
	>
		<el-row :class="{beat: true, beat__playing: !stopped}" :gutter="20">
			<el-col :span="14" class="beat__left">
				<el-button
					:title="`${beat.name}, bpm: ${bpmCurrent}` + (pianoCurrent ? `, piano: ${this.chordsList.join(' ')}` : '')"
					@click="play({force: true})"
				>{{ name || beat.name }}</el-button>
				<el-button
					@click="toggle"
				>{{ stopped ? 'Play' : 'Stop' }}</el-button>
				{{ playDelay }}
				<div v-if="isPianoInDrums">
					octave:
					<el-radio-group  v-model="pianoPitchOffset" size="mini">
						<el-radio-button :label="-12">-1</el-radio-button>
						<el-radio-button :label="0">0</el-radio-button>
						<el-radio-button :label="+12">+1</el-radio-button>
					</el-radio-group>
				</div>
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
				slow:
				<el-radio-group  v-model="chordBeats" size="mini">
					<el-radio-button title="2" label="2">2</el-radio-button>
					<el-radio-button title="4" label="4">4</el-radio-button>
					<el-radio-button title="8" label="8">8</el-radio-button>
				</el-radio-group>

				style:
				<el-radio-group  v-model="pianoStyle" size="mini">
					<el-radio-button title="12312312" label="12312312">12312312</el-radio-button>
					<el-radio-button title="all" label="all">all</el-radio-button>
					<el-radio-button title="1-23--1-23" label="1-23--1-23">1-23--1-23</el-radio-button>
				</el-radio-group>
			</el-col>
		</el-row>
		<div v-if="error">{{ error }}</div>

  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";
.beat {
	padding: 0 0 5px 0;
}
.beat__playing {
	background: var(--bg-hover);
}
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
	'E5': [40, 44, 47], // [40, 47],
	'E7': [40, 44, 47], // [40, 44, 47, 50],
	'Em': [40, 43, 47],
	'Em7': [40, 43, 47], // [40, 43, 47, 50],
	'C': [36, 40, 43],
	'C5': [36, 40, 43], // [36, 43],
	'Cm': [36, 39, 43],
	'Cmaj': [36, 40, 43], // [36, 40, 43, 47]
	'Cmaj7': [36, 40, 43], // [36, 40, 43, 47]
	'C#': [37, 41, 44],
	'D': [38, 42, 45],
	'D5': [38, 42, 45], // [38, 45]
	'Dm': [38, 41, 45],
	'Hm': [35, 38, 42],
	'Bm': [35, 38, 42],
	'H': [35, 39, 42], // [47, 51, 54],
	'B': [35, 39, 42], // [47, 51, 54],
	'H5': [35, 39, 42], // [35, 42],
	'B5': [35, 39, 42], // [35, 42],
	'B7': [35, 39, 42], // [47, 51, 54],
	'H7': [35, 39, 42], // [47, 51, 54],
	'G': [43, 47, 50],
	'G5': [43, 47, 50], // [43, 50],
	'Gm': [43, 46, 50],
	'G6': [43, 47, 50], // [43, 47, 50, 52],
	'G#': [44, 48, 51],
	'F': [41, 45, 48],
	'Fm': [41, 44, 48],
	'F5': [41, 45, 48], // [41, 48],
	'F#': [42, 46, 49],
	'A': [45, 49, 52],
	'A5': [45, 49, 52], // [45, 52],
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

			stopped: true,
			bpmCurrent: 0,
			reverCurrent: false,
			pianoAllowed: false,
			pianoCurrent: this.piano,
			pianoStyle: "12312312",
			chordBeats: 4,
			error: '',
			songDrums: null,
			songPiano: null,
			pianoPitchOffset: -12,
			forcePlay: true,
			playStartTime: 0, // TODO: remove
			playDelay: '', // TODO: remove
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
			const min = this.bpm * 0.5;
			return this.bpmForce ? Math.min(this.bpmForce, min) : min;
		},
		bpmMax() {
			const max = this.bpm * 2;
			return this.bpmForce ? Math.max(this.bpmForce, max) : max;
		},
		highestPitch() {
			return this.songDrums?.highestNote?.pitch;
		},
		isPianoInDrums() {
			return this.highestPitch >= 60;
		},
		chordsList() {
			let chords = this.chords?.replace(/\(.*?\)/g, '').trim().split(' ') || [];
			if (chords.length === 2) {
				chords = [chords[0], chords[0], chords[1], chords[1]];
			}

			// untranspose, for piano
			let transpose = this.$store.state.defaultTransposeLevel;
			if (transpose) {
				transpose = transpose * -1;
				chords = chords.map(chord => {
					chord = this.$store.getters.transposeChord(chord, transpose);
					return chord;
				});
			}
			// console.log('chords: ', chords);
			return chords;
		},
  },
	watch: {
		activeSong(val) {
			if (!val) this.stop();
		},
		pianoCurrent(val) {
			this.songPiano.active = val;
			// this.loadPiano();
			// this.replay(this);
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
			this.loadPiano();
			this.replay(this);
		},
	},
  methods: {
		/*beep(freqAfter, freq = 1000, time = 20) {
			if (!this.oscillator) {
				this.oscillator = this.audioContext.createOscillator();
        this.oscillator.type = 'square';
        this.oscillator.start();
				this.oscillator.connect(this.audioContext.destination);
			}
			this.oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);
			setTimeout(() => {
				this.oscillator.frequency.setValueAtTime(freqAfter, this.audioContext.currentTime);
			}, time);
		},*/
		shortkey(e) {
			// console.log('shortkey: ', e);

			/* const pitch = 42;
			const instr = instrDrumsMap[pitch];
			const when = 0;
			const duration = 0.5;
			const v = 1;
			this.error = this.audioContext.outputLatency;
			this.beep(0);
			this.player.queueWaveTable(this.audioContext, this.input, window[instr], when, pitch, duration, v, []);
			return; */

			if (['b', 'bRus', 'pgUp'].includes(e.srcKey)) this.play({force: true});
			if (['c', 'cRus'].includes(e.srcKey) && this.pianoAllowed) {
				this.pianoCurrent = !this.pianoCurrent;
				// this.play({force: false});
			}
			if (['d', 'dRus', 'pgDn'].includes(e.srcKey)) this.toggle();

		},
		toggle() {
			if (this.stopped) this.play({force: false});
			else this.stop();
		},
    play({ force = true }) {
			// console.log('play: ', force);
			this.stop();
			this.playStartTime = Date.now();
			this.error = '';
			this.forcePlay = force || (!this?.songDrums?.song && !this?.songPiano?.song);
			if (this.forcePlay) {
				// this.loadDrums();

				if (this.pianoCurrent) this.loadPiano();

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
			}

			// console.log('this.songDrums: ', this.songDrums.song);
			// console.log('this.songPiano: ', this.songPiano.song);

			this.startLoad(this.songDrums.song || this.songPiano.song);
    },

		loadPiano() {
			if (!this.pianoAllowed) return;
			// console.log('loadPiano: ');
			this.songPiano.song = this.buildSongFromChords();
			this.songPiano.songOrig = this.songPiano.song;
			this.songPiano.active = this.pianoCurrent;
		},

		loadDrums() {
			const beat = beats.find(b => b.name === this.beat.name);
			if (beat) {
				// console.log('midiFile: ', midiFile);
				const midiArrayBuffer = this.base64ToArrayBuffer(beat.data);
				const midiFile = new MIDIFile(midiArrayBuffer);
				this.songDrums.song = midiFile.parseSong();
				this.songDrums.isDrums = true;

				// sorted uniq by note.pitch
				const allNotesSorted = this.songDrums.song.tracks[0].notes.sort((a, b) => a.pitch - b.pitch);
				this.songDrums.lowestNote = allNotesSorted[0];
				this.songDrums.highestNote = allNotesSorted[allNotesSorted.length - 1];
				// console.log('s.lowestNote: ', s.lowestNote);
				// console.log('s.highestNote: ', s.highestNote);
			}

		},
		replay: debounce((self) => {
  		if (!self.stopped) self.play({force: true});
		}, 500),

		songInit() {
			return {
				song: null,
				isDrums: false,
				plays: 0,
				active: true, // or muted
				currentSongTime: 0,
				songStartFirst: 0,
				songStart: 0,
				nextStepTime: 0,
				lowestNote: null,
				highestNote: null,
			}
		},
		applyBpm(song) {
			const songBpm = JSON.parse(JSON.stringify(song));
			songBpm.duration = song.duration * this.bpmMultiplier;

			// const origNotes = [...song.tracks[0].notes];
			// console.log('origNotes: ', origNotes);
			const bpmNotes = song.tracks[0].notes.map(note => {
				return {...note, ...{
					when: note.when * this.bpmMultiplier,
				}};
			});
			songBpm.tracks[0].notes = bpmNotes;
			// console.log('bpmNotes: ', bpmNotes);

			return songBpm;
		},


		stop() {
			if (!this.player) return;
			this.stopped = true;
			this.playDelay = '';
			this.player.cancelQueue(this.audioContext);
		},

    startLoad(song) {
			// with equalizer and reverberator
			if (this.reverCurrent && this.audioContext) {
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

			// load all notes
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
				// console.log('Delay before onLoad: ', Date.now() - this.playStartTime);
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

          this.stopped = false;

					// intro 4 beats (1st beat for preload)
					if (this.forcePlay) {
						const pitch = 42;
						const instr = instrDrumsMap[pitch];
						const offset = 60000 / this.bpmCurrent;
						for (let i = 0; i < 5; i++) {
							setTimeout(() => {
								const vol = i == 0 ? 0.001 : 1 / 7;
                if (this.stopped) return;
								this.player.queueWaveTable(this.audioContext, this.input, window[instr], 0, pitch, duration, vol, []);
							}, offset*i);
						}

						setTimeout(() => {
              if (this.stopped) return;
							this.startPlay(song);
						}, offset * 5);
					}
					// immediate play
					else {
						this.startPlay(song);
					}
				}, 1);
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

			// build piano song with style

			const songNotes = [];

			// style 12312312
			if (this.pianoStyle == "12312312") {
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

				// repeat notes
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
			}

			// style all
			if (this.pianoStyle == "all") {
				this.error = "style all is not implemented yet.";
				return;

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

				// repeat notes
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
			}

			// style 1-23--1-23
			if (this.pianoStyle === "1-23--1-23") {
				const styleMidi = beats.find(b => b.name === 'style-piano-1-23--1-23-100-bpm');
				const midiArrayBuffer = this.base64ToArrayBuffer(styleMidi.data);
				const midiFile = new MIDIFile(midiArrayBuffer);
				const songStyle = midiFile.parseSong();
				console.log('songStyle: ', songStyle);

				const notes = songStyle.tracks[0].notes;
				console.log('notes: ', notes);
				// build notes from chord for chordBeats
				/* let noteIndex = 0;
				for (let chordNum = 0; chordNum < this.chords.length; chordNum++) {
					const note = notes[noteIndex + chordNum];
					const chordNotes = chordNotesMap[chordNum];
					if (!chordNotes) {
						this.error = `Chord ${note.pitch} not found.`
						// console.log('cannot find notes for chord: ', );
						return;
					}

					const notesPerChord = 3; //chordBeats * ticksPerBeat;
					for (let chordNoteNum = 0; chordNoteNum < notesPerChord; chordNoteNum++) {
						const pitch = chordNotes[chordNoteNum];
						songNotes.push({...note, ...{
							pitch,
						}});
					}
				} */
			}

			return song;
		},

  	startPlay() {
			// this.stopped = false;
			const stepDuration = 44 / 1000;

			// console.log('Delay before startPlay: ', Date.now() - this.playStartTime);
			for (let s of [this.songDrums, this.songPiano]) {
				if (!s.song) continue;
				if (!s.songOrig) {
					s.songOrig = {...s.song};
				}
				s.song = this.applyBpm(s.songOrig);
				s.currentSongTime = 0;

				s.songStartFirst = this.audioContext.currentTime;
				s.songStart = this.audioContext.currentTime;
				s.nextStepTime = this.audioContext.currentTime;

				s.plays = 0;

        // offset for sound latency
				if (!this.forcePlay) {
					const offset = this.audioContext.outputLatency + 0.11; // на 100 мс тормозит дополнительно, примерно
					s.currentSongTime += offset;
					s.songStart -= offset;
					s.songStartFirst -= offset;
					// s.nextStepTime = this.audioContext.currentTime;
					// this.error = `start: ${s.songStart}<br>currentTime: ${s.currentSongTime}<br>nextStepTime: ${s.nextStepTime}`
				}

				// console.log('s.song: ', s.song);
				// console.log('song.info.title: ', s.song?.tracks[0]?.info?.title);
				// console.log('song.info.url: ', s.song?.tracks[0]?.info?.url);
				// console.log('song.info.variable: ', s.song?.tracks[0]?.info?.variable);

				// fix beats, calculate beatsCount from song duration
				s.beatDuration = 60 / this.bpmCurrent;
				s.songBeatsCount = Math.round(s.song.duration / s.beatDuration);
				s.songBeatsDuration = s.songBeatsCount * s.beatDuration;
				// console.log('songBeatsCount: ', songBeatsCount);

				console.log('Delay before first tick: ', Date.now() - this.playStartTime);

				this.tick(s, stepDuration);
			}
			// this.currentSongTime = 0;
			// this.songStart = this.audioContext.currentTime;
			// this.nextStepTime = this.audioContext.currentTime;
			// this.tick(song, stepDuration);
		},
    tick(song, stepDuration) {
			if (!song) return;
			if (this.audioContext.currentTime > song.nextStepTime - stepDuration) {
				this.sendNotes(song.song, song.songStart, song.currentSongTime, song.currentSongTime + stepDuration, this.audioContext, this.input, this.player, song.isDrums, song.active);
				song.currentSongTime = song.currentSongTime + stepDuration;
				song.nextStepTime = song.nextStepTime + stepDuration;

				// the end of the song, loop, sync
				if (song.currentSongTime > song.songBeatsDuration) {
					// TODO: sync all songs there
					// console.log('song.currentSongTime: ', song.currentSongTime);
					// song.currentSongTime = song.currentSongTime - song.song.duration; // обнуление лучше высчитывания, не слышно стыка
					song.currentSongTime = 0
					this.sendNotes(song.song, song.songStart, 0, song.currentSongTime, this.audioContext, this.input, this.player, song.isDrums, song.active);
					// song.songStart = song.songStart + song.song.duration;
					song.plays++;
					console.log('plays: ', song.plays);

					// fix song start but song duration not exaclty matches to bpm
					// const durationFromPlay = song.plays * song.song.duration;
					// song.songStart = song.songStartFirst + durationFromPlay;

					const timeFromPlay = song.plays * song.songBeatsDuration;
					// console.log('timeFromPlay: ', timeFromPlay);
					song.songStartRounded = timeFromPlay;
					song.songStartRelative = this.audioContext.currentTime - song.songStartFirst;
					song.songDelta = song.songStartRelative - song.songStartRounded;

					// song.songStart = song.songStartFirst + timeFromPlay * beatDuration;
					song.songStart = song.songStartFirst + timeFromPlay - song.songDelta;

					if (song.isDrums && this.songPiano.song) {
						// reset piano also
						this.songPiano.currentSongTime = 0;
						this.songPiano.songStart = song.songStart;
						this.sendNotes(this.songPiano.song, this.songPiano.songStart, 0, this.songPiano.currentSongTime, this.audioContext, this.input, this.player, this.songPiano.isDrums, song.active);
					}

					// console.log(`songStartFirst: `, song.songStartFirst);
					// console.log(`songStartRounded: `, song.songStartRounded);
					// console.log(`songStartRelative: `, song.songStartRelative);
					// console.log(`songDelta: `, song.songDelta);
					// console.log(`song.songStart (drums: ${song.isDrums ? 'y':'n'}): `, song.songStart);
				}
			}
			window.requestAnimationFrame(() => {
				if (!this.stopped) this.tick(song, stepDuration);
			});
		},
    sendNotes(song, songStart, start, end, audioContext, input, player, isDrums=false, active) {
			if (!song) return;
			if (!active) return;
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

						let pitch = track.notes[i].pitch;
						if (isDrums) {
							// piano, pitch > 59 are piano notes, not drums
							if (pitch >= 60) {
								// transpose depends of pianoPitchOffset
								pitch = pitch + this.pianoPitchOffset;
							}
							// drums, set instr mapped by notes
							else {
								instr = instrDrumsMap[pitch] || track.info.variable;
							}
						}
						// var v = track.volume / 7;
						var v = track.volume;
						// console.log('instr: ', instr);
						// console.log('pitch: ', pitch);

						if (!this.playDelay) {
							this.playDelay = Date.now() - this.playStartTime;
							console.log('Delay before send first note: ', this.playDelay);
						}
						player.queueWaveTable(audioContext, input, window[instr], when, pitch, duration, v, track.notes[i].slides);
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

		this.songDrums = this.songInit();
		this.songPiano = this.songInit();
		this.loadDrums();
		this.loadPiano();

		// init audio context
		const AudioContextFunc = window.AudioContext || window.webkitAudioContext;
		// this.audioContext = new AudioContextFunc();
		this.audioContext = new AudioContextFunc({
			latencyHint: "interactive",
			sampleRate: 44100,
		});
		this.player = new WebAudioFontPlayer();

		/* window.document.addEventListener("keydown", (e) => {
			this.error = `key press: ${e.code}}`;
		}); */

		const listInputsAndOutputs = (midiAccess) => {
			this.error = `midi inputs: ${midiAccess.inputs.size}, outputs: ${midiAccess.outputs.size}`;
			this.error = `baseLatency: ${this.audioContext.baseLatency}`;
			console.log('midiAccess.outputs: ', midiAccess.outputs);
			for (const entry of midiAccess.inputs) {
				const input = entry[1];
				const msg = `Input port [type:'${input.type}']` +
						` id:'${input.id}'` +
						` manufacturer:'${input.manufacturer}'` +
						` name:'${input.name}'` +
						` version:'${input.version}'`;
				console.log(msg);
				// this.error = msg;
			}

			for (const entry of midiAccess.outputs) {
				const output = entry[1];
				console.log(
					`Output port [type:'${output.type}'] id:'${output.id}' manufacturer:'${output.manufacturer}' name:'${output.name}' version:'${output.version}'`,
				);
			}
		}

		/* let midi = null; // global MIDIAccess object
		function onMIDISuccess(midiAccess) {
			console.log("MIDI ready!");
			midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)
			listInputsAndOutputs(midiAccess);
		}

		function onMIDIFailure(msg) {
			console.error(`Failed to get MIDI access - ${msg}`);
		}

		navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure); */
	},
	beforeDestroy() {
		this.stop();
	},
};
</script>
