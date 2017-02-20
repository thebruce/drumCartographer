import test from 'ava';
const DrumMapCsvCollector = require('./../lib/drumMapCsvCollector');

test('setSrc', t => {
 t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
 t.drumCsv.setSrc('test');
 t.is(t.drumCsv.getSrc(),
 'test'
 );
});

test('validateSrcTrue', t => {
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  return t.drumCsv.validateSrc()
  .then((value) => {
    t.true(value);
  });

});

test('validateThrows', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testThree.txt');
  t.throws(
    t.drumCsv.validateSrc()
  );
});

test('addPath',  t => {
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  return t.drumCsv.addPath(t.drumCsv.getSrc())
  .then((result) => {
    t.true(result);
  })
});

test('addPathFalseNoExist', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testFour.txt');
  t.throws(
   t.drumCsv.addPath(t.drumCsv.getSrc())
  );
});

test('walkPathseNoExist', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testFour.txt');
  t.throws(
   t.drumCsv.walkPaths()
  );
});

test('collectPaths', t => {
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  return t.drumCsv.collectPaths()
  .then((result) => {
    t.deepEqual(
      Object.keys(result),
      [
        "./test/helpers/testCsvs/testOne.csv"
      ]
    )
 });
});

test('collectPathsFolders', t => {
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs');
  return t.drumCsv.collectPaths()
  .then((result) => {
    t.deepEqual(
      Object.keys(result).sort(),
      [
        "/testFour.csv",
        "/testOne.csv",
        "/testTwo.csv"
      ]
    )
 });
});

test('isDirectoryTrue', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  const value = await t.drumCsv.isDirectory('./test/helpers/');
  t.true(value);
});

test('isDirectoryFalseNotDirectory', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  const value = await t.drumCsv.isDirectory('./test/helpers/testCsvs/testOne.csv');
  t.false(value);
});

test('isDirectoryThrows', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  t.throws(
    t.drumCsv.isDirectory('./test/helpers/doesNotExist/')
  );
});

test('isFileTrue', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  const value = await t.drumCsv.isCsvFile('./test/helpers/testCsvs/testOne.csv');
  t.true(value);
});

test('isFileNotCsv', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  const value = await t.drumCsv.isCsvFile('./test/helpers/testCsvs/testThree.txt');
  t.false(value);
});

test('isFileFalseNotFile', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  const value = await t.drumCsv.isCsvFile('./test/helpers/testCsvs/');
  t.false(value);
});

test('isFileThrows', async t => {
  t.plan(1);
  t.drumCsv = new DrumMapCsvCollector('./test/helpers/testCsvs/testOne.csv');
  t.throws(
    t.drumCsv.isCsvFile('./test/helpers/testCsvs/doesNotExist.csv')
  );
});
