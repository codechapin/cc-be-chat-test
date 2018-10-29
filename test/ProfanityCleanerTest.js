const test = require('ava');
const ProfanityCleaner = require('../lib/ProfanityCleaner');

test("simple replace", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('hell'), '****');
});

test("at the beginning replace", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('hellboy'), '****boy');
});

test("two words concatenated", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('hella55'), '*******');
});

test("two words concatenated but with a short one", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('hella'), '****a');
});

test("only spaces", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('    '), '    ');
});

test("multiple spaces", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean(' hell a '), ' **** a ');
});


test("long message with 2 replacements", t => {
  const cleaner = createCleaner();

  t.is(cleaner.clean('hella of a hot a55 trip with you\'all. It was fun!'), '****a of a hot *** trip with you\'all. It was fun!');
});

const createCleaner = () => {
  return new ProfanityCleaner(
    createWords(),
    3
  )
};

const createWords = () => {
  return ['hell', 'a55'];
};

