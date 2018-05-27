#!/bin/bash
rm -rf dist
npm run generate
cd dist
git init
git add -A
git commit -m "deploy"
git remote add origin git@github.com:popstas/chords-viewer.git
git push --force origin master:gh-pages
cd ..
