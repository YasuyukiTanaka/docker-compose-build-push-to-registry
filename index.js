const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const process = require('process');
const util = require('util');
const exec = util.promisify(require('child_process').exec)

async function executeDocerCompose(serviceName, pushName) {
  try {
    const { buildStdout, buildStderr } = await exec(`docker-compose -f ./docker-compose.yml build ${serviceName}`);
    console.log('buildStdout:', buildStdout);
    console.log('buildStderr:', buildStderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
  }
}

try {
  // `service-name` input defined in action metadata file
  const serviceName = core.getInput('service-name') || "noting";
  console.log(`task param is ${serviceName}!`);


  // `push-name` input defined in action metadata file
  const pushName = core.getInput('push-name') || "noting";
  console.log(`task param is ${pushName}!`);
  
  // `working-directory` input defined in action metadata file
  const workingDirectory = core.getInput('working-directory')  || "nothing";
  console.log(`working-directory param is ${workingDirectory}!`);
 
  fs.statSync(workingDirectory);
  process.chdir(workingDirectory);
  
  executeDocerCompose(serviceName, pushName);
} catch (error) {
  core.setFailed(error.message);
}
