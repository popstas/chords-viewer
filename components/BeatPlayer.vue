<template>
  <div
    v-if="!$store.state.readerMode"
    class="beat-player"
    v-shortkey="{a:['a'], aRus: ['ф'], b:['b'], bRus: ['и'], c:['c'], cRus: ['с'], d:['d'], dRus: ['в'], pgUp: ['pageup'], pgDn: ['pagedown']}"
    @shortkey="shortkey"
  >
    <!-- play/stop, rever, bpm -->
    <el-row :class="{beat: true, beat__playing: !stopped}" :gutter="20">
      <el-col :span="11" class="beat__left">
        <el-button
          :title="`${beat.name}, bpm: ${bpmCurrent}` + (pianoCurrent ? `, piano: ${this.chordsList.join(' ')}` : '')"
          @click="play({force: true})"
        >{{ name || beat.name }}
        </el-button>
        <el-button
          @click="toggle"
        >{{ stopped ? 'Play' : 'Stop' }}
        </el-button>
        <!--{{ playDelay }}-->
      </el-col>
      <el-col :span="3" class="beat__rever">
        <el-checkbox-button class="beat__checkbutton" v-model="reverCurrent">rever</el-checkbox-button>
      </el-col>
      <el-col :span="4" class="beat__bpm">
        <BPMMeter :bpm="bpmCurrent" @change="setBpm"></BPMMeter>
      </el-col>
      <el-col :span="6" class="beat__right">
        <el-slider v-model="bpmCurrent" :min="bpmMin" :max="bpmMax"></el-slider>
      </el-col>
    </el-row>

    <!-- piano, octave -->
    <el-row class="beat__octave" v-if="isPianoInDrums || pianoAllowed">
      <el-col :span="8" class="beat__octave-left">
        <el-checkbox-button class="beat__checkbutton" v-model="pianoCurrent" v-if="pianoAllowed">piano
        </el-checkbox-button>
        <el-checkbox-button class="beat__checkbutton" v-model="pianoSustain">sustain</el-checkbox-button>
      </el-col>
      <el-col :span="16" class="beat__octave-right">
        <span class="beat__label">octave:</span>
        <el-radio-group v-model="pianoPitchOffset" size="mini">
          <el-radio-button :label="-12">-2</el-radio-button>
          <el-radio-button :label="0">-1</el-radio-button>
          <el-radio-button :label="12">0</el-radio-button>
          <el-radio-button :label="24">+1</el-radio-button>
          <el-radio-button :label="36">+2</el-radio-button>
          <!-- <el-radio-button :label="48">+3</el-radio-button> -->
        </el-radio-group>
      </el-col>
    </el-row>

    <!-- piano speed, instrument -->
    <el-row v-if="pianoAllowed" class="beat__piano" :gutter="20">
      <el-col :span="24" class="beat__left">
        <!--<span class="beat__label">slow:</span>-->
        <el-radio-group v-model="chordBeats" size="mini">
          <el-radio-button title="2" label="2">2</el-radio-button>
          <el-radio-button title="4" label="4">4</el-radio-button>
          <el-radio-button title="8" label="8">8</el-radio-button>
        </el-radio-group>

        <el-radio-group v-model="pianoInstrument" size="mini">
          <el-radio-button v-for="el of pianoInstruments" :key="el.id" :label="el.id">{{ el.label }}</el-radio-button>
        </el-radio-group>
        <el-checkbox-button class="beat__checkbutton" v-model="customInstrumentSelect">...</el-checkbox-button>
      </el-col>
    </el-row>

    <!-- dynamic custom instrument select -->
    <el-row v-if="customInstrumentSelect" class="beat__piano beat__custom-instrument" :gutter="20">
      <el-col :span="24" class="beat__left">
        <span class="beat__label">custom instrument:</span>
        <el-input-number v-model="customInstrumentNum" :min="0" :max="1395" size="mini"></el-input-number>
        <br/>
        <span class="beat__label" style="display: inline-block; width: 22px">all:</span>
        <el-select style="width: 324px; margin: 3px 0;" v-model="customInstrumentNum" placeholder="Select">
          <el-option
            v-for="item in customInstruments"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <br/>
        <span class="beat__label" style="display: inline-block; width: 22px">best:&nbsp;</span>
        <el-select style="width: 324px" v-model="customInstrumentNum" placeholder="Select">
          <el-option
            v-for="item in customInstrumentsPicked"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <!-- piano style -->
    <el-row v-if="pianoAllowed" class="beat__piano" :gutter="20">
      <el-col :span="24" class="beat__left">
        <span class="beat__label">style:</span>
        <el-radio-group v-model="pianoStyle" size="mini">
          <el-radio-button class="piano-style-button" title="12312312" label="12312312">12312312</el-radio-button>
          <el-radio-button class="piano-style-button" title="min-3-4" label="min-3-4">min 3/4</el-radio-button>
          <el-radio-button class="piano-style-button" title="force" label="force">force</el-radio-button>
          <el-radio-button class="piano-style-button" title="flat" label="flat">flat</el-radio-button>
          <br/>
          <el-radio-button class="piano-style-button" title="1232" label="1232">1232</el-radio-button>
          <el-radio-button class="piano-style-button" title="1-123--1-123" label="1-123--1-123">min</el-radio-button>
          <el-radio-button class="piano-style-button" title="force_3_4" label="force_3_4">force 3/4</el-radio-button>
          <el-radio-button class="piano-style-button" title="flat-full" label="flat-full">flat-full</el-radio-button>
          <!-- <el-radio-button title="test" label="test">test</el-radio-button> -->
        </el-radio-group>
        <!-- <el-slider v-model="pianoVolume" :min="0" :max="1" :step="0.1"></el-slider> -->
      </el-col>
    </el-row>
    <div class="beat__error" v-if="error">{{ error }}</div>

  </div>
</template>

<style lang="scss">
@import "@/assets/variables.scss";

.beat {
  padding: 0 0 5px 0;
}

.beat,
.beat__octave,
.beat__piano {
  margin-right: 0 !important; // avoid horizontal scroll
}

.beat__label {
  font-size: 10px;
}

.beat__error {
  color: var(--border-hover);
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

.beat__octave-right {
  text-align: right;
}

.piano-style-button .el-radio-button__inner {
  width: 80px;
  display: inline-block;
  text-align: center;
}

.beat__checkbutton {
  .el-checkbox-button__inner {
    padding: 3px 6px;
    border-radius: 4px !important;
    border: 1px solid var(--border) !important;
    font-weight: normal !important;
    color: var(--color) !important;
  }

  &.is-checked .el-checkbox-button__inner {
    background-color: transparent !important;
    border-color: var(--border-hover) !important;
    color: var(--color) !important;
    box-shadow: none;
  }
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
import "../assets/instruments/accordion.js";
import "../assets/instruments/vocal.js";
import BPMMeter from "@/components/BPMMeter.vue";
import {chordNotesMap} from "~/store";

const debug = false;

const bpmDefault = 100;
const pianoInstrumentsMap = {
  'piano': '_tone_0000_JCLive_sf2_file',
  'accordion': '_tone_0210_Aspirin_sf2_file',
  'vocal': '_tone_0520_Chaos_sf2_file',
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
  components: {BPMMeter},
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
      pianoInstrument: "_tone_0000_JCLive_sf2_file",
      customInstrumentSelect: true,
      customInstrumentNum: 0,
      customInstruments: [],
      customInstrumentsPicked: [],
      customInstrumentsPickedNums: [315, 320, 346],
      pianoCurrent: this.piano,
      pianoStyle: "12312312",
      pianoVolume: 0.2,
      chordBeats: 4,
      error: '',
      songDrums: null,
      songPiano: null,
      pianoPitchOffset: 12,
      pianoSustain: true,
      forcePlay: true,
      playStartTime: 0, // TODO: remove
      playDelay: '', // TODO: remove
      firstPlay: true,
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

      if (chords.length > 4) chords = chords.slice(0, 4);

      // untranspose, for piano
      let transpose = this.$store.state.defaultTransposeLevel;
      if (transpose) {
        transpose = transpose * -1;
        chords = chords.map(chord => {
          chord = this.$store.getters.transposeChord(chord, transpose);
          return chord;
        });
      }
      return chords;
    },
    pianoInstruments() {
      const instruments = [];
      for (let instr in pianoInstrumentsMap) {
        instruments.push({id: pianoInstrumentsMap[instr], label: instr});
      }
      return instruments;
    },
  },
  watch: {
    activeSong(val) {
      if (!val) this.stop();
    },
    pianoCurrent(val) {
      this.songPiano.active = val;
    },
    pianoStyle() {
      this.loadPiano();
    },
    customInstrumentNum(val) {
      if (!val) return;
      this.loadCustomInstrument(val);
    },
    bpmCurrent() {
      const debouncedApplyBpm = debounce((self) => {
        for (const s of [self.songDrums, self.songPiano]) {
          if (!s || !s.songOrig) continue;
          s.song = self.applyBpm(s.songOrig);
        }
      }, 500);
      debouncedApplyBpm(this);
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
    chordBeats() {
      this.loadPiano();
      this.replay(this);
    },
  },
  methods: {
    setBpm(bpm) {
      this.bpmCurrent = bpm;
    },
    shortkey(e) {
      if (['b', 'bRus', 'pgUp'].includes(e.srcKey)) this.play({force: true});
      if (['c', 'cRus'].includes(e.srcKey) && this.pianoAllowed) {
        this.pianoCurrent = !this.pianoCurrent;
      }
      if (['d', 'dRus', 'pgDn'].includes(e.srcKey)) this.toggle();
    },
    toggle() {
      if (this.stopped) this.play({force: false});
      else this.stop();
    },
    // force - from the beginning
    play({force = true}) {
      this.stop();
      this.playStartTime = Date.now();
      this.error = '';
      this.forcePlay = force || (!this?.songDrums?.song && !this?.songPiano?.song) || this.firstPlay;
      this.firstPlay = false;
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
      } else {
        this.stopped = false; // immediate play only when no force
      }

      this.startLoad(this.songDrums.song || this.songPiano.song);
    },

    loadPiano() {
      if (!this.pianoAllowed) return;
      this.songPiano.songOrig = this.buildSongFromChords();
      this.songPiano.song = this.applyBpm(this.songPiano.songOrig);
      if (debug && this.songPiano.song) this.listSongNotes(this.songPiano.song);
      this.songPiano.active = this.pianoCurrent;
    },

    loadDrums() {
      const beat = beats.find(b => b.name === this.beat.name);
      if (beat) {
        const midiArrayBuffer = this.base64ToArrayBuffer(beat.data);
        const midiFile = new MIDIFile(midiArrayBuffer);
        this.songDrums.song = midiFile.parseSong();
        this.songDrums.isDrums = true;

        const allNotesSorted = this.songDrums.song.tracks[0].notes.sort((a, b) => a.pitch - b.pitch);
        this.songDrums.lowestNote = allNotesSorted[0];
        this.songDrums.highestNote = allNotesSorted[allNotesSorted.length - 1];
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
      if (!song) return;
      const songBpm = JSON.parse(JSON.stringify(song));
      songBpm.duration = song.duration * this.bpmMultiplier;

      songBpm.tracks[0].notes = song.tracks[0].notes.map(note => {
        return {
          ...note, ...{
            when: note.when * this.bpmMultiplier,
          }
        };
      });
      return songBpm;
    },


    stop() {
      if (!this.player) return;
      this.stopped = true;
      this.playDelay = '';
      this.player.cancelQueue(this.audioContext);
    },

    listSongNotes(song, verbose = false) {
      if (!verbose) {
        const lines = [];
        let nn = 1;
        let line = [];
        song.tracks[0].notes.map(note => {
          line.push(note.pitch);
          if (nn > 0 && nn % 8 === 0) {
            lines.push(line);
            line = [];
          }
          nn++;
        });
        if (line.length > 0) lines.push(line);

        console.log('notes: \n' + lines.map(line => line.join(' ')).join('\n'));
      } else {
        const notes = [];
        song.tracks[0].notes.map(note => {
          const n = {
            pitch: note.pitch,
            when: note.when,
            // duration: note.duration,
          };
          if (note.label) n.label = note.label;
          notes.push(n);
        });
        console.log('notes full: \n', notes);
      }
    },

    playIntroSound(vol) {
      const pitch = 42;
      const instr = instrDrumsMap[pitch];
      const duration = 0.5;
      this.player.queueWaveTable(this.audioContext, this.input, window[instr], 0, pitch, duration, vol, []);
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
        // console.log('Delay before onLoad: ', Date.now() - this.playStartTime);
        setTimeout(async () => {
          // preload drums
          if (!this.pianoCurrent) {
            const uniqNotes = [...new Set(song.tracks[0].notes.map(note => note.pitch))];
            for (let i = 0; i < uniqNotes.length; i++) {
              const instr = instrDrumsMap[uniqNotes[i]];
              this.player.loader.decodeAfterLoading(this.audioContext, instr); // https://github.com/surikov/webaudiofont/issues/23
            }
          } else {
            this.player.loader.decodeAfterLoading(this.audioContext, song.tracks[0].info.variable);
          }

          setTimeout(() => this.stopped = false, 100); // timeout for correct stop while replay

          // intro 4 beats (1st beat for preload)
          if (this.forcePlay) {
            const tickDuration = 60000 / this.bpmCurrent;
            let ticks = 5;
            if (this.$store.state.beatFirstPlay) {
              ticks = 6;
            }
            if (this.audioContext.state === 'suspended') {
              await this.audioContext.resume();
            }

            for (let i = 0; i < ticks; i++) {
              setTimeout(() => {
                const vol = i === 0 ? 0.001 : 1 / 7;
                if (this.stopped) return;
                this.playIntroSound(vol);
              }, tickDuration * i);
            }

            setTimeout(() => {
              if (this.stopped) return;
              this.startPlay(song);
            }, tickDuration * ticks);
          }
          // immediate play
          else {
            this.startPlay(song);
          }

          if (this.$store.state.beatFirstPlay) {
            this.$store.commit('beatFirstPlay', false);
          }
        }, 1);
      }
      this.player.loader.waitLoad(onLoad);
    },

    loadCustomInstrument(n) {
      const info = this.player.loader.instrumentInfo(n)
      this.player.loader.startLoad(this.audioContext, info.url, info.variable);
      this.player.loader.waitLoad(() => {
        // console.log(`change instrument: ${info.title} (${info.variable})`);
        this.pianoInstrument = info.variable;
        // this.player.cancelQueue(this.audioContext);
      });
    },

    buildCustomInstruments() {
      const instruments = [];
      for (let i = 0; i < this.player.loader.instrumentKeys().length; i++) {
        const opt = {
          value: i,
          label: `${i}: ${this.player.loader.instrumentInfo(i).title}`,
        };
        if (this.customInstrumentsPickedNums.includes(i)) {
          this.customInstrumentsPicked.push(opt);
        }
        instruments.push(opt);
      }
      return instruments;
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
            variable: this.pianoInstrument,
          },
          notes: [],
        }],
        beats: [],
        duration: totalBeats * beatDuration * repeats,
      };

      const duration = 0.3;

      // build piano song with style

      if (this.pianoStyle === "test") {
        let offset = 0;
        for (let pitch = 36; pitch < 100; pitch++) {
          for (let i = 0; i < 1; i++) {
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

      // style 12312312
      if (this.pianoStyle === "12312312") {
        const songNotes = [];
        for (let i = 0; i < chords.length; i++) {
          const chordNotes = chordNotesMap[chords[i]];
          if (!chordNotes) {
            this.error = `Chord ${chords[i]} not found.`
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

      // style 1232
      if (this.pianoStyle === "1232") {
        const songNotes = [];
        // build notes from chord for chordBeats
        for (let i = 0; i < chords.length; i++) {
          const chordNotes = chordNotesMap[chords[i]];
          if (!chordNotes) {
            this.error = `Chord ${chords[i]} not found.`
            return;
          }
          const notesPerChord = chordBeats * ticksPerBeat;
          const sequence = [0, 1, 2, 1];
          for (let j = 0; j < notesPerChord; j++) {
            const noteNum = sequence[j % sequence.length];
            // octave up for third note
            const pitchOffset = noteNum === 2 ? 12 : 0;
            const pitch = chordNotes[noteNum] + pitchOffset;
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

      // style force
      if (this.pianoStyle === "force" || this.pianoStyle === "force_3_4") {
        let notes = [];
        let offset = 0;
        // repeat notes
        for (let r = 0; r < repeats; r++) {
          // every chord
          for (let i = 0; i < chords.length; i++) {
            // 4 tacts
            const tacts = chordBeats * 2;
            for (let tick = 0; tick < tacts; tick++) {
              const chordNotes = chordNotesMap[chords[i]];
              if (!chordNotes) {
                this.error = `Chord ${chords[i]} not found.`
                return;
              }
              // 3/4 ticks
              const majorTick = this.pianoStyle === 'force_3_4' ? 2 : 0;
              if (tick % 4 !== majorTick) {
                notes.push({
                  when: offset,
                  pitch: chordNotes[0],
                  duration,
                  slides: [],
                });
              }
              // all notes every 1/4
              else {
                notes.push(...chordNotes.map(pitch => {
                  return {
                    when: offset,
                    pitch,
                    duration,
                    slides: [],
                  };
                }));
              }

              offset += tickDuration;
            }
          }
        }

        song.tracks[0].notes = notes;
      }

      // style flat
      if (this.pianoStyle === "flat" || this.pianoStyle === "flat-full") {
        let notes = [];
        let offset = 0;
        // repeat notes
        for (let r = 0; r < repeats; r++) {
          // every chord
          for (let i = 0; i < chords.length; i++) {
            // 4 tacts
            const tacts = chordBeats * 2;
            for (let tick = 0; tick < tacts; tick++) {
              const chordNotes = chordNotesMap[chords[i]];
              if (!chordNotes) {
                this.error = `Chord ${chords[i]} not found.`
                return;
              }
              const onlyFirstNote = this.pianoStyle === "flat";
              if (onlyFirstNote) {
                notes.push({
                  when: offset,
                  pitch: chordNotes[0],
                  duration: duration * 4,
                  slides: [],
                });
              } else {
                // all notes
                notes.push(...chordNotes.map(pitch => {
                  return {
                    when: offset,
                    pitch,
                    duration,
                    slides: [],
                  };
                }));
              }

              offset += tickDuration;
            }
          }
        }

        song.tracks[0].notes = notes;
      }


      // midi styles
      const notesMap = {
        52: 0, // E
        48: 1, // C
        55: 2, // G
        50: 3, // D
      };

      // style 1-123--1-123
      if (this.pianoStyle === "1-123--1-123") {
        song.tracks[0].notes = this.buildSongFromStyle({
          chords,
          style: this.pianoStyle,
          notesMap,
        });
      }

      // style force-last
      if (this.pianoStyle === "min-3-4") {
        song.tracks[0].notes = this.buildSongFromStyle({
          chords,
          style: this.pianoStyle,
          notesMap,
        });
      }

      if (this.error) {
        console.log('broken song: ');
        this.listSongNotes(song, true);
        return null;
      }

      return song;
    },

    buildSongFromStyle({chords, style, notesMap}) {
      // 8-16 tacts in piano midi
      const styleMidi = beats.find(b => b.name === `style-piano-${style}-100-bpm`);
      const midiArrayBuffer = this.base64ToArrayBuffer(styleMidi.data);
      const midiFile = new MIDIFile(midiArrayBuffer);
      const songStyle = midiFile.parseSong();


      if (debug) console.log('songStyle: ', songStyle);
      // this.listSongNotes(songStyle, true);

      let chordCurrent = -1;
      let noteCurrent = 0;
      let notes = [];
      let noteNums = [];
      const tacts = Math.round(songStyle.duration / (60 / bpmDefault));
      const chordChangeEvery = this.chordBeats / (tacts / 4);
      let chordChanges = 0;
      let lastChordNum = -1;
      const bpmMultiplier = bpmDefault / this.midiBpm;

      for (let i = 0; i < 8; i++) {
        const midiNotes = songStyle.tracks[0].notes.map(note => {
          const offset = i * songStyle.duration * bpmMultiplier;
          const chordNum = notesMap[note.pitch];
          let label = '';
          if (chordNum !== undefined && chordNum !== lastChordNum) {
            lastChordNum = chordNum;
            noteNums = [
              note.pitch + 12,
              note.pitch + 16,
              note.pitch + 19,
            ];
            if (chordChanges % chordChangeEvery === 0) {
              chordCurrent = chordCurrent === 3 ? 0 : chordCurrent + 1; // chordNum
              label = 'change chord: ' + chordCurrent;
            }
            chordChanges++;
          }

          noteCurrent++;

          const chord = chords[chordCurrent];
          const chordNotes = chordNotesMap[chord];
          if (!chordNotes) {
            this.error = `Chord ${chord} not found.`
            console.log('cannot find notes for chord: ', chord);
            return note;
          }

          const chordNoteNum = noteNums.findIndex(n => n === note.pitch);
          const isBassNote = notesMap[note.pitch] !== undefined;

          if (chordNoteNum === -1 && !isBassNote) {
            this.error = `Skip note ${note.pitch}.`
            note.label = 'skip';
            console.log('skip note: ', note.pitch);
            return note;
          }

          const pitch = isBassNote ? chordNotes[0] - 12 : chordNotes[chordNoteNum];

          return {
            ...note, ...{
              pitch,
              when: offset + note.when * bpmMultiplier,
              label,
            }
          };
        });
        notes.push(...midiNotes);
      }
      return notes;
    },

    startPlay() {
      const stepDuration = 44 / 1000;
      // console.log('Delay before startPlay: ', Date.now() - this.playStartTime);
      for (let s of [this.songDrums, this.songPiano]) {
        if (!s.song) continue;
        if (!s.songOrig) {
          s.songOrig = {...s.song};
        }
        if (s.isDrums) s.song = this.applyBpm(s.songOrig);
        if (!s.isDrums && debug) {
          console.log('s.song: ', s.song);
          this.listSongNotes(s.song, true);
        }

        s.currentSongTime = 0;

        s.songStartFirst = this.audioContext.currentTime;
        s.songStart = this.audioContext.currentTime;
        s.nextStepTime = this.audioContext.currentTime;

        s.plays = 0;

        if (this.songPiano.song) {
          // TODO: preload online
          // this.player.adjustPreset(this.audioContext, window[this.pianoInstrument]);
        }

        // offset for sound latency
        if (!this.forcePlay) {
          const offset = this.audioContext.outputLatency + 0.11; // на 100 мс тормозит дополнительно, примерно
          s.currentSongTime += offset;
          s.songStart -= offset;
          s.songStartFirst -= offset;
        }

        // fix beats, calculate beatsCount from song duration
        s.beatDuration = 60 / this.bpmCurrent;
        s.songBeatsCount = Math.round(s.song.duration / s.beatDuration);
        s.songBeatsDuration = s.songBeatsCount * s.beatDuration;
        // console.log('Delay before first tick: ', Date.now() - this.playStartTime);

        this.tick(s, stepDuration);
      }
    },
    tick(song, stepDuration) {
      if (!song) return;
      if (this.audioContext.currentTime > song.nextStepTime - stepDuration) {
        this.sendNotes(song.song, song.songStart, song.currentSongTime, song.currentSongTime + stepDuration, song.isDrums, song.active);
        song.currentSongTime = song.currentSongTime + stepDuration;
        song.nextStepTime = song.nextStepTime + stepDuration;

        // the end of the song, loop, sync
        if (song.currentSongTime > song.songBeatsDuration) {
          song.currentSongTime = 0
          this.sendNotes(song.song, song.songStart, 0, song.currentSongTime, song.isDrums, song.active);
          song.plays++;
          console.log('plays: ', song.plays);

          // adjust songStart for better bpm sync with external apps
          const timeFromPlay = song.plays * song.songBeatsDuration;
          song.songStartRounded = timeFromPlay;
          song.songStartRelative = this.audioContext.currentTime - song.songStartFirst;
          song.songDelta = song.songStartRelative - song.songStartRounded;
          song.songStart = song.songStartFirst + timeFromPlay - song.songDelta;

          if (song.isDrums && this.songPiano.song) {
            // reset piano also
            this.songPiano.currentSongTime = 0;
            this.songPiano.songStart = song.songStart;
            this.sendNotes(this.songPiano.song, this.songPiano.songStart, 0, this.songPiano.currentSongTime, this.songPiano.isDrums, this.songPiano.active);
          }
        }
      }
      window.requestAnimationFrame(() => {
        if (!this.stopped) this.tick(song, stepDuration);
      });
    },
    sendNotes(song, songStart, start, end, isDrums = false, active) {
      if (!song) return;
      if (!active) return;
      for (let t = 0; t < song.tracks.length; t++) {
        const track = song.tracks[t];
        for (let i = 0; i < track.notes.length; i++) {
          if (track.notes[i].when >= start && track.notes[i].when < end) {
            const when = songStart + track.notes[i].when;
            if (isNaN(when)) {
              console.log('when is NaN: ');
              console.log('songStart: ', songStart);
              console.log('track.notes[i].when: ', track.notes[i].when);
              continue;
            }
            let duration = track.notes[i].duration;
            if (duration > 3) {
              duration = 3;
            }
            let instr = track.info.variable;

            let pitch = track.notes[i].pitch;
            if (isDrums) {
              // piano, pitch > 59 are piano notes, not drums
              if (pitch >= 60) {
                // transpose depends of pianoPitchOffset
                pitch = pitch + this.pianoPitchOffset;
                if (this.pianoSustain) duration = duration * 2;
              }
              // drums, set instr mapped by notes
              else {
                instr = instrDrumsMap[pitch] || track.info.variable;
              }
            } else {
              // piano pitch
              pitch = pitch + this.pianoPitchOffset;
              // replace instrument to this.pianoInstrument on the fly
              instr = instr.replace(track.info.variable, this.pianoInstrument);

              if (this.pianoSustain) duration = duration * 2;
            }

            const v = isDrums ? track.volume : this.pianoVolume;
            if (debug && !isDrums) console.log('pitch: ', pitch);

            if (!this.playDelay) {
              this.playDelay = Date.now() - this.playStartTime;
              // console.log('Delay before send first note: ', this.playDelay);
            }
            this.player.queueWaveTable(this.audioContext, this.input, window[instr], when, pitch, duration, v, track.notes[i].slides);
          }
        }
      }
      /*for (let b = 0; b < song.beats.length; b++) {
        const beat = song.beats[b];
        for (let i = 0; i < beat.notes.length; i++) {
          if (beat.notes[i].when >= start && beat.notes[i].when < end) {
            const when = songStart + beat.notes[i].when;
            const duration = 1.5;
            const instr = beat.info.variable;
            const v = beat.volume / 2;
            this.player.queueWaveTable(this.audioContext, this.input, window[instr], when, beat.n, duration, v);
          }
        }
      }*/
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
    this.customInstruments = this.buildCustomInstruments();

    // read piano params from url
    if (this.pianoAllowed) {
      const {
        piano,
        piano_instrument,
        octave,
        piano_style,
        chord_beats,
        piano_sustain
      } = this.$router.history.current.query;
      if (piano) this.pianoCurrent = true;
      if (piano_instrument) this.pianoInstrument = pianoInstrumentsMap[piano_instrument];
      if (piano_style) this.pianoStyle = piano_style;
      if (piano_sustain) this.pianoSustain = !!piano_sustain;
      if (chord_beats) this.chordBeats = parseInt(chord_beats);
      if (octave) this.pianoPitchOffset = octave * 12;
    }
  },
  beforeDestroy() {
    this.stop();
  },
};
</script>
