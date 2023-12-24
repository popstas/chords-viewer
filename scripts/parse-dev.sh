#!/bin/bash
set -eu
cd /d/projects/js/chords-parser
npm start
cp chords.json ../chords-viewer/chords.json

cd /d/projects/js/chords-viewer
npm run build-beats
npm run dev
