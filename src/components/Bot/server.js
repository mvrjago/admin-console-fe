const express = require('express');
const bodyParser = require('body-parser');
const { spawn, exec } = require('child_process');
const cors = require('cors');



const app = express();
const port = 5000;

app.use(bodyParser.json());

const scriptProcesses = {};

app.post('/control', (req, res) => {
  const { scriptName, action } = req.body;
  const scriptPath = `./scripts/${scriptName}`;

  // Stopping or restarting a script if it's already running
  if (scriptProcesses[scriptName] && (action === 'stop' || action === 'restart')) {
    scriptProcesses[scriptName].kill();
    delete scriptProcesses[scriptName];
    console.log(`${scriptName} stopped.`);
    if (action === 'stop') {
      return res.send(`${scriptName} stopped.`);
    }
  }

  // Starting or restarting a script
  if (action === 'start' || action === 'restart') {
    const process = spawn('python', [scriptPath]);
    scriptProcesses[scriptName] = process;
    console.log(`${scriptName} started.`);

    process.stdout.on('data', (data) => {
      console.log(`${scriptName}: ${data}`);
    });

    process.stderr.on('data', (data) => {
      console.error(`${scriptName}: ${data}`);
    });

    process.on('close', (code) => {
      console.log(`${scriptName} process exited with code ${code}`);
      delete scriptProcesses[scriptName];
    });

    return res.send(`${scriptName} started.`);
  }

  res.status(400).send('Invalid action');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
