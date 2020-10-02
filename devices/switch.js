const { find, get, isUndefined } = require('lodash');
const Base = require('./base');

/**
* A Switch device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Switch extends Base {
  state() {
    const state = get(this.data, 'state');
    if (isUndefined(state)) {
      return;
    }
    return state;
  }

  async turnOn() {
    const { success } = await this.api._deviceControl(this.device.id, 'turnOnOff', { value: '1' });
    if (success) {
      this.data.state = true;
    }
  }

  async turnOff() {
    const { success } = await this.api._deviceControl(this.device.id, 'turnOnOff', { value: '0' });
    if (success) {
      this.data.state = false;
    }
  }

  update() {
    // Avoid get cache value after control.
    return setTimeout(async () => {
      const devices = await this.api.discovery()
      if (isUndefined(devices)) {
        return;
      }
      const device = find(devices, { id: this.device.id });
      if (device) {
        this.data = device.data;
        return true;
      }
    }, 500);
  }
}
module.exports = Switch;
