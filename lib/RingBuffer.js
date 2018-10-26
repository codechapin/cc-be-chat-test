class RingBuffer {
  // A ring buffer should be faster since we don't need to delete elements
  // it has some CPU cost but the math is easy.
  constructor(size) {
    this.sink = new Array(size);
    this.position = 0;
  }

  push(item) {
    if (item === undefined) {
      // we probably should throw an exception.
      // we need this check since we undefined as
      // a way to check the state of the ring
      return;
    }

    this.sink[this.position] = item;
    // this allows us to go back to 0 when the ring is full
    this.position = (this.position + 1) % this.sink.length;
  }

  last() {
    return this.sink[this.position - 1];
  }

  empty() {
    return this.position === 0;
  }

  all() {
    const result = [];

    const walker = this.walk();
    while (walker.hasNext()) {
      result.push(walker.next());
    }

    return result;
  }

  walk() {
    return new Walker(this.sink, this.position);
  }
}

class Walker {
  constructor(sink, position) {
    // to be safe we should clone the array so the position doesn't move while we iterate.
    this.sink = sink.slice(0);
    this.position = position;
    this.tmp = position;
    this.index = 0;

    if (this.sink[this.position + 1] === undefined ) {
      // we haven't fill the ring yet. We start from the beginning.
      this.position = 0;
    }

  }

  hasNext() {

    this.tmp = (this.position + 1) % this.sink.length;

    return this.index < this.sink.length && this.sink[this.position] !== undefined;
  }

  next() {
    this.index++;

    const item = this.sink[this.position];
    this.position = this.tmp;
    return item;
  }

}

module.exports = RingBuffer;