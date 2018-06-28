# chords-viewer

## Russian
Смотрелка для chords.json, сгенерированного через [chords-parser](https://github.com/popstas/chords-parser).

Мои аккорды: https://chords.popstas.ru

![demo](/static/demo.gif)

### Возможности
- Аккорды фиксируются при промотке песни и всегда видны
- Поиск по названию или словам из песни
- Быстрый переход по первой букве имени исполнителя
- Голосовой поиск
- Поиск на amdm.ru
- Автопрокрутка текста с настройкой скорости
- Транспонирование аккордов
- Выбор случайной песни
- При наведении на аккорд показывается аппликатура
- Режим "не спать" для телефонов
- Сайт может работать без интернета, если хоть раз на него зайти

### Требования
Чтобы собрать, нужно положить `chords.json` в корень проекта.
Данные моих аккордов лежат на github и могут быть скачаны через `npm run update-data`.



## English
View chords.json generated with [chords-parser](https://github.com/popstas/chords-parser).

### Features
- Fixed chords while scroll
- Search by title and lyrics
- Quick search by first letter of title
- Voice search
- Search on amdm.ru
- Autoscroll with speed control
- Transpose chords
- Chords images
- Random song
- No sleep mode for phones
- Single Page Application
- Static site, hosted anywhere
- PWA (offline access, when deployed to https domain)

### Requirements
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
npm install
npm update-data
npm deploy
```

## New version

``` bash
npm version
```
