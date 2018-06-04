# chords-viewer

View chords.json generated with [chords-parser](https://github.com/popstas/chords-parser).

## Features
- Fixed chords while scroll
- Search by title and lyrics
- Quick search by first letter of title
- Voice search
- Autoscroll with speed control
- Transpose chords
- Chords images
- Links to chord images
- No sleep mode for phones
- Single Page Application
- Static site, hosted anywhere
- PWA (offline access, when deployed to https domain)

## Requirements
`chords.json` should be placed in project root. You can download my data with command `npm run update-data`.

## Build Setup

``` bash
# install dependencies
npm install
npm run update-data

# serve with hot reload at localhost:3001
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).
