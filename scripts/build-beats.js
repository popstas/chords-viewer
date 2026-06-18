/**
 * nodejs script
 * read assets/midi/*.mid
 * Operations with each file:
 * - convert file data to base64
 * - save to object { name: "filename", data: base64data }
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const { basename } = require('path');

const assetsPath = path.resolve(__dirname, '../assets');
const midiPath = path.resolve(assetsPath, 'midi');

const build = async () => {
  const files = (await glob(`${midiPath}/*.mid`)).sort();
  const data = files.map((file) => {
    const name = basename(file, '.mid');
    const data = fs.readFileSync(file).toString('base64');
    return { name, data };
  });
  // save to beats.json
  fs.writeFileSync(`${assetsPath}/beats.json`, JSON.stringify(data));
}

build();
