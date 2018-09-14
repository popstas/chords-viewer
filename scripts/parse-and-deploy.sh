#!/bin/bash
cd /c/projects/js/chords-parser && npm start && npm run deploy
sleep 5
cd /c/projects/js/chords-viewer && npm run update-data && npm run deploy
