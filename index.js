const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const process = require('process');
const util = require('util');
const exec = util.promisify(require('child_process').exec)

async function executeDocerCompose(serviceName, pushName) {
  try {
    var { stdout, stderr } = await exec(`docker-compose -f ./docker-compose.yml build ${serviceName}`);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    const imageName = stdout.match(/Successfully tagged ([a-z:_]+)/)[1];
    console.log('imageName:', imageName);
    var { stdout, stderr } = await exec(`docker tag ${imageName} ${pushName}` );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    var { stdout, stderr } = await exec(`docker push ${pushName}` );
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
  } catch (e) {
    console.error(e); // should contain code (exit code) and signal (that caused the termination).
    throw e;
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
