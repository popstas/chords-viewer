## Build Setup

You should use yarn!

``` bash
# install dependencies
npm install
npm run update-data

# serve with hot reload at localhost:3001
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start
```

## Full build of chords.popstas.ru

``` bash
git clone https://github.com/popstas/chords-parser.git
cd chords-parser
npm install
npm start
npm deploy

cd ..
git clone https://github.com/popstas/chords-viewer.git
yarn install
npm update-data
npm deploy
```

## New version

``` bash
npm version
```
