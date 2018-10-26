const inquirer = require('inquirer');
const webSocket = require('ws');

// seems like this could be bad idea. making this global.
// Putting here sometimes shows double lines.
// We shouldn't create bottom-bar more than once because it
// causes an error.
// If I had more time, it would have been fun to use
// blessed instead: https://www.npmjs.com/package/blessed
// Maybe, I will still do it :)
// Suggestion: I think this test should have more UI
// available. It was hard for me not to spend way too
// much time in inquirer trying to make things look better.
const ui = new inquirer.ui.BottomBar();

const run = async () => {
  const url = 'ws://localhost:3000/';
  const ws = await openChat(url, incomingHandler);
  console.log(`Chat client connected to ${url}`);

  process.on('warning', e => console.warn(e.stack));

  const {name} = await askName();

  while (true) {
    const answers = await askChat();
    const {message} = answers;

    ws.send(JSON.stringify({
      name: name,
      message: message
    }));
  }
};

const openChat = async (url, handler) => {
  const ws = new webSocket(url);

  await new Promise(resolve => {
    ws.on('open', resolve);
  });

  // I don't remember this very well, but I recall that
  // promises get resolved only once. We will use old style
  // event handling for that reason.
  ws.on('message', handler);

  return ws;
};

const incomingHandler = (incoming) => {
  try
  {
    const bag = JSON.parse(incoming);

    for (let envelop of bag) {
      ui.log.write(`[${envelop['name']}]: ${envelop['message']}`);
    }
  } catch (e) {
    console.warn(e.stack);
  }

};

const askName = () => {
  const questions = [
    {
      name: "name",
      type: "input",
      message: "Enter your name:"
    }
  ];
  return inquirer.prompt(questions);
};

const askChat = () => {
  const questions = [
    {
      name: "message",
      type: "input",
      message: "Enter chat message:",

    }
  ];
  return inquirer.prompt(questions);
};

run();
