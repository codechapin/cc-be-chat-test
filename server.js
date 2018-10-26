const WebSocket = require('ws');
const MessageBus = require('./lib/MessageBus');

const run = () => {
  const port = 3000;
  const wss = new WebSocket.Server({ port: port});
  const messageBus = new MessageBus();

  console.log(`Chat server started on port ${port}`);

  wss.on('connection', messageBus.onConnectionCreated);

  // TODO: Need to handle when clients disconnect.
  // When they do the server is in bad shape.
};

run();

