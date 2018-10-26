const RingBuffer = require('./RingBuffer');

class MessageBus {
  constructor() {
    this.connections = new Set();
    this.ring = new RingBuffer(50);

    this.onConnectionCreated = this.onConnectionCreated.bind(this);
    this.onIncomingMessage = this.onIncomingMessage.bind(this);
  }

  onConnectionCreated(connection) {

    this.connections.add(connection);

    if (!this.ring.empty()) {
      connection.send(JSON.stringify(this.ring.all()));
    }

    connection.on('message', this.onIncomingMessage);

    console.log('A new user has connected to this chat server.');
  }

  onIncomingMessage(message) {
    // we put it in an array to make it consistent in the client
    const envelop = JSON.parse(message);
    // TODO: handle special commands and clean up profanity words.
    // For the profanity words. Probably a recursion is needed and match
    // substrings to values in a Map. I spent quite a bit of time reading a bit
    // Set and Map in JS. It seems that they are similar to LinkedHashMap and
    // LinkedHashSet in Java. A Map is faster but likely will use more memory,
    // an option would be to use a Trie and even more memory efficient a Trie with
    // these ideas:
    // http://stevehanov.ca/blog/index.php?id=120
    // But the list the profanity words is small, a Map should suffice for the moment.


    this.ring.push(envelop);

    // if you were to have a lot of users this could take a while
    // you probably want to distribute this between multiple
    // workers. Thankfully node.js is non-blocking so that gives
    // some room to do this easily.
    const bag = JSON.stringify([envelop]);
    console.log(`Sending to everybody: ${bag}`);
    for (let connection of this.connections) {

      connection.send(bag);
    }
  }
}

module.exports = MessageBus;