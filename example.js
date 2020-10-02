const debug = require('debug')('tuya-cloud');
const TuyaCloud = require('./index');

async function main() {
  const api = new TuyaCloud({
    userName: 'USERNAME',
    password: 'PASSWORD',
    bizType: 'tuya',
    countryCode: '33',
    region: 'eu',
  });

  // Connect to cloud api
  await api.login();

  // Get all devices registered on the Tuya app
  const devices = await api.discoverDevices();
  debug(`devices ${JSON.stringify(devices)}`);


  // Get a device by his ID
  const device = await api.getDeviceById('DEVICE_ID');
  debug(`device ${JSON.stringify(device)}`);

  // Get state of a single device
  const deviceState = device.state();
  debug(`deviceState ${deviceState}`);

  // Check if feature 'support_stop' is supported
  const supported = await device.supportFeature('support_stop');
  debug(`supported ${supported}`);

  // Turn ON switch and OFF 5s after
  await devices[0].turnOn();
  setTimeout(async () => {
    // Then OFF after 5s
    await devices[0].turnOff();
  }, 5000);
}
main();
