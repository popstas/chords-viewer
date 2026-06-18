#!/bin/bash
set -eu

rm -rf dist
npm run update-data
npm run build-beats
npm run generate
# GitHub Pages runs Jekyll, which ignores underscore-prefixed dirs (_nuxt).
# .nojekyll disables Jekyll so _nuxt assets are served instead of 404'd.
touch dist/.nojekyll
cd dist
git init
git add -A
git commit -m "deploy"
git remote add origin git@github.com:popstas/chords-viewer.git
git push --force origin master:gh-pages
cd ..
