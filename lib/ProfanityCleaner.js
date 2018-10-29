class ProfanityCleaner {
  constructor(profanityWordList, smallestLength) {
    // I spent quite some time reading about Set and Map in JS. It seems that they
    // are similar to LinkedHashMap and LinkedHashSet in Java. Decided to use a Set
    // s faster since its O(1), but likely will use more memory, an option would be
    // to use a Trie. It would be interesting to see how would perform a Trie with
    // these ideas:
    // http://stevehanov.ca/blog/index.php?id=120
    // Since the list of profanity words is small, a Set should suffice for the moment.
    //
    // shortestWord is used as a way to speed up the lookups.
    this.profanityWordList = new Set(profanityWordList);
    this.shortestWord = smallestLength;
    this.SPACE = ' ';
    this.REPLACEMENT = '*';
  }

  clean(message) {
    // best case, the message is too short
    if (message.length < this.shortestWord) {
      return message;
    }

    // annoying that JS doesn't provide something like Java's StringBuffer.
    // created the buffer because I think it will be more efficient to replace
    // the words with *. Mostly with long messages with several words to censor.
    // Otherwise we could use substring.
    const buffer = message.split('');

    this.find(message, buffer, 0, 1);

    return buffer.join('');
  }

  find(message, buffer, start, end) {
    if (this.isSpace(message, start)) {
      // handling spaces at the front, say we have: 'a55 trip'.
      // after finding 'a55', the next word would be: ' '. We should skip that
      // space and move to the next letter, which would be 't'.
      //
      // Probably should be a loop to handle multiple spaces
      start = this.constrainlength(message, start + 1);
      end = this.constrainlength(message, end + 1);
    }

    if (start >= message.length) {
      // we are at the end, exit.
      return;
    }

    const sub = message.substring(start, end);

    // no need to check for words that are smaller than smallest in the word list
    if (sub.length < this.shortestWord && end < message.length) {

      start = this.moveIfEndOfWord(message, start, end);

      this.find(message, buffer, start, end + 1);

      return;
    }

    if (this.profanityWordList.has(sub)) {
      this.replace(buffer, start, end);

      // are we done yet?
      if (end >= message.length) {
        // yeah, we are done.
        return;
      }

      // we did a replacement, so create the new state based on that.
      let newStart =  end;
      let newEnd = end + 1;

      this.find(message, buffer, newStart, newEnd);

    } else if (end < message.length) {

      // at end of a word?
      start = this.moveIfEndOfWord(message, start, end);

      this.find(message, buffer, start, end + 1);
    }
  }

  replace(buffer, start, end) {
    for (let i = start; i < end; i++) {
      buffer[i] = this.REPLACEMENT;
    }
  }

  isSpace(message, position) {
    return message.charAt(position) === this.SPACE;
  }

  moveIfEndOfWord(message, start, end) {
    return this.isSpace(message, end) ? end : start;
  }

  constrainlength(message, length) {
    return length < message.length ? length : message.length;
  }


}

module.exports = ProfanityCleaner;

