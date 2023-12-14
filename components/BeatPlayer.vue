<template>
  <div class="beat-player">
    <el-button
      @click="play"
    >{{ name || beat.name }}</el-button>
		<el-button @click="toggle">{{ stopped ? 'Play' : 'Stop' }}</el-button>
  </div>
</template>

<style lang="scss">
</style>

<script>
import WebAudioFontPlayer from 'webaudiofont';
import MIDIFile from '../MIDIFile.js';

import beats from "~/assets/beats.json";
import "../assets/instruments/drums0.js";

const instrMap = {
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
  props: ["beat", "name"],
  data() {
    return {
			equalizer: null,
			reverberator: null,
      player: null,
      audioContext: null,
      currentSongTime: 0,
      songStart: 0,
      nextStepTime: 0,
			nextPositionTime: 0,
			stopped: true,
    };
  },
  computed: {
		activeSong() {
      return this.$store.state.activeSong;
    },
		midiBpm() {
			// get bpm from beat.name, e.g. 'loop-2-tum-tum-120-bpm', with regex
			const parsedBpm = this.beat.name.match(/(\d+)-bpm/);
			return parsedBpm && parseInt(parsedBpm[1]) || 100;
		},
		bpm() {
			return this.beat.bpm || this.midiBpm;
		},
		bpmMultiplier() {
			return this.midiBpm / this.bpm;
		},
  },
	watch: {
		activeSong(val) {
			if (!val) this.stop();
		},
	},
  methods: {
		toggle() {
			if (this.stopped) this.play();
			else this.stop();
		},
    play() {
      /* var Player = new MidiPlayer.Player(function(event) {
        console.log(event);
      }); */
      const beat = beats.find(b => b.name === this.beat.name);
      if (!beat) return;

      // midi-player-js
      /* Player.loadFile(filename);
      Player.play(); */

      // webaudiofont
      // console.log('WebAudioFontPlayer: ', WebAudioFontPlayer);
      // console.log('MIDIFile: ', MIDIFile);
      this.player = new WebAudioFontPlayer();
      // console.log('webaudiofont: ', webaudiofont);
      const midiArrayBuffer = this.base64ToArrayBuffer(beat.data);
      const midiFile = new MIDIFile(midiArrayBuffer);
      // console.log('midiFile: ', midiFile);
      const song = midiFile.parseSong();

			song.duration = song.duration * this.bpmMultiplier;

			// const origNotes = [...song.tracks[0].notes];
			// console.log('origNotes: ', origNotes);
			const bpmNotes = song.tracks[0].notes.map(note => {
				note.when = note.when * this.bpmMultiplier;
				return note;
			});
			song.tracks[0].notes = bpmNotes;
			// console.log('bpmNotes: ', bpmNotes);
      this.startLoad(song);
    },

		stop() {
			if (!this.player) return;
			this.stopped = true;
			this.player.cancelQueue(this.audioContext);
		},

    startLoad(song) {
			var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
			this.audioContext = new AudioContextFunc();
			this.player = new WebAudioFontPlayer();

			this.equalizer = this.player.createChannel(this.audioContext);
			this.reverberator = this.player.createReverberator(this.audioContext);
			// input = reverberator.input;
			this.input = this.equalizer.input;
			this.equalizer.output.connect(this.reverberator.input);
			this.reverberator.output.connect(this.audioContext.destination);

			for (let i = 0; i < song.tracks.length; i++) {
				const nn = this.player.loader.findInstrument(song.tracks[i].program);
				const info = this.player.loader.instrumentInfo(nn);
				song.tracks[i].info = info;
				song.tracks[i].id = nn;
				this.player.loader.startLoad(this.audioContext, info.url, info.variable);
			}
			for (let i = 0; i < song.beats.length; i++) {
				const nn = this.player.loader.findDrum(song.beats[i].n);
				const info = this.player.loader.drumInfo(nn);
				song.beats[i].info = info;
				song.beats[i].id = nn;
				this.player.loader.startLoad(this.audioContext, info.url, info.variable);
			}

      const onLoad = () => {
				// this.sendNotes(song, this.songStart, this.currentSongTime, this.currentSongTime + stepDuration, this.audioContext, this.input, this.player);
				setTimeout(() => {
					const pitch = 42;
					const instr = instrMap[pitch];
					const duration = 0.5;
					// const vol = 1 / 7;
					const offset = 60000 / this.bpm;

					const uniqNotes = [...new Set(song.tracks[0].notes.map(note => note.pitch))];
					// play uniqNotes with volume 0.001
					for (let i = 0; i < uniqNotes.length; i++) {
						const vol = 0.001;
						const instr = instrMap[uniqNotes[i]];
						this.player.queueWaveTable(this.audioContext, this.input, window[instr], 0, uniqNotes[i], duration, vol, []);
					}
					
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

  	startPlay(song) {
			this.stopped = false;
			this.currentSongTime = 0;
			this.songStart = this.audioContext.currentTime;
			this.nextStepTime = this.audioContext.currentTime;
			const stepDuration = 44 / 1000;
			this.tick(song, stepDuration);
		},
    tick(song, stepDuration) {
			if (this.audioContext.currentTime > this.nextStepTime - stepDuration) {
				this.sendNotes(song, this.songStart, this.currentSongTime, this.currentSongTime + stepDuration, this.audioContext, this.input, this.player);
				this.currentSongTime = this.currentSongTime + stepDuration;
				this.nextStepTime = this.nextStepTime + stepDuration;
				if (this.currentSongTime > song.duration) {
					// console.log('this.currentSongTime: ', this.currentSongTime);
					// this.currentSongTime = this.currentSongTime - song.duration; // обнуление лучше высчитывания, не слышно стыка
					this.currentSongTime = 0
					this.sendNotes(song, this.songStart, 0, this.currentSongTime, this.audioContext, this.input, this.player);
					this.songStart = this.songStart + song.duration;
				}
			}
			if (this.nextPositionTime < this.audioContext.currentTime) {
				// var o = document.getElementById('position');
				// o.value = 100 * this.currentSongTime / song.duration;
				// document.getElementById('tmr').innerHTML = '' + Math.round(100 * this.currentSongTime / song.duration) + '%';
				this.nextPositionTime = this.audioContext.currentTime + 3;
			}
			window.requestAnimationFrame(() => {
				if (!this.stopped) this.tick(song, stepDuration);
			});
		},
    sendNotes(song, songStart, start, end, audioContext, input, player) {
			for (var t = 0; t < song.tracks.length; t++) {
				var track = song.tracks[t];
				for (var i = 0; i < track.notes.length; i++) {
					if (track.notes[i].when >= start && track.notes[i].when < end) {
						var when = songStart + track.notes[i].when;
						var duration = track.notes[i].duration;
						if (duration > 3) {
							duration = 3;
						}
						var instr = track.info.variable;

						const pitch = track.notes[i].pitch;
						instr = instrMap[pitch] || track.info.variable;
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
	beforeDestroy() {
		this.stop();
	},
};
</script>
