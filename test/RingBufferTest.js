const test = require('ava');
const RingBuffer = require('../lib/RingBuffer');

test("empty", t => {
  const ring = new RingBuffer(5);

  t.is(ring.empty(), true);
});

test("not empty", t => {
  const ring = new RingBuffer(5);
  ring.push(1);

  t.is(ring.empty(), false);
});

test("get last added", t => {
  const ring = new RingBuffer(5);
  ring.push(1);
  ring.push(2);
  ring.push(3);

  t.is(ring.last(), 3);
});

test("walker returns in right order", t => {
  const ring = new RingBuffer(5);
  ring.push(1);
  ring.push(2);
  ring.push(3);
  ring.push(4);
  ring.push(5);
  ring.push(6);
  ring.push(7);
  ring.push(8);

  t.is(ring.last(), 8);

  const result = ring.all();
  const expected = [4, 5, 6, 7, 8];

  t.is(result.length, expected.length);

  for (let i = 0; i < expected.length; i++) {
    t.is(result[i], expected[i]);
  }

});

test("walker returns only valid values", t => {
  const ring = new RingBuffer(10);
  ring.push(1);
  ring.push(2);
  ring.push(3);
  ring.push(4);
  ring.push(5);

  t.is(ring.last(), 5);

  const result = ring.all();
  const expected = [1, 2, 3, 4, 5];

  t.is(result.length, expected.length);

  for (let i = 0; i < expected.length; i++) {
    t.is(result[i], expected[i]);
  }

});
