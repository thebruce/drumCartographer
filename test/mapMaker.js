import test from 'ava';
const DrumMapCsvCollector = require('./../lib/drumMapCsvCollector');
const MapMaker = require('./../lib/mapMaker');

test('setCsvObject', t => {
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  return t.drumCsv.collectPaths()
  .then((paths) => {
    t.maker = new MapMaker(paths);
    t.maker.setCsvObject('thing');
    t.is(t.maker.getCsvObject(),
    'thing'
    )
  })
});