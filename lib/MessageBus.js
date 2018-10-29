const RingBuffer = require('./RingBuffer');
const ProfanityCleaner = require('./ProfanityCleaner');
const wordList = require('./profanityList');

class MessageBus {
  constructor() {

    // sort the words by size so we can find the shortest word.
    // making a copy, that way we keep the original sorting.
    const sorted = wordList.slice(0);
    sorted.sort((a, b) => {
      return a.length - b.length;
    });

    this.cleaner = new ProfanityCleaner(wordList, sorted[0].length);
    // keeping this RingBuffer won't be good for scaling, because each worker will have
    // its own copy. It should probably be stored in Redis/Mongo or something like that.
    this.ring = new RingBuffer(50);
    this.connections = new Set();

    this.onConnectionCreated = this.onConnectionCreated.bind(this);
    this.onIncomingMessage = this.onIncomingMessage.bind(this);
  }

  onConnectionCreated(connection) {

    this.connections.add(connection);

    if (!this.ring.empty()) {
      try {
        connection.send(JSON.stringify(this.ring.all()));
      } catch (e) {
        // weird the connection got dropped very quickly
        console.log('connection dropped by client while sending previous messages.')
      }
    }

    connection.on('message', this.onIncomingMessage);

    console.log('A new user has connected to this chat server.');
  }

  onIncomingMessage(message) {
    const envelop = JSON.parse(message);
    // TODO: handle special commands

    envelop.message = this.cleaner.clean(envelop.message);

    this.ring.push(envelop);

    // if you were to have a lot of users this could take a while
    // you probably want to distribute this between multiple
    // workers. Thankfully node.js is non-blocking so it gives room to grow.

    // we put it in an array to make it consistent in the client
    const bag = JSON.stringify([envelop]);
    console.log(`Sending to everybody: ${bag}`);
    for (let connection of this.connections) {
      try {
        connection.send(bag);
      } catch(e) {
        // more likely the connection is closed with the client.
        this.connections.delete(connection);
      }

    }
  }
}

module.exports = MessageBus;