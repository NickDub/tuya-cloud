const { get, times } = require('lodash');
const Base = require('./base');

/**
* A Fan device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Fan extends Base {
  state() {
    return get(this.data, 'state') === 'true';
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

  speed() {
    return get(this.data, 'speed');
  }

  speedList() {
    const speedList = [];
    const speedLevel = get(this.data, 'speed_level');
    return times(speedLevel, Number).map(i => (i + 1).toString());
  }

  oscillating() {
    return get(this.data, 'direction');
  }

  async setSpeed(speed) {
    await this.api._deviceControl(this.device.id, 'windSpeedSet', { value: speed });
  }

  async oscillate(oscillating) {
    const command = oscillating ? 'swingOpen' : 'swingClose';
    await this.api._deviceControl(this.device.id, command);
  }

  supportOscillate() {
    return this.oscillating() ? true : false;
  }

  supportDirection() {
    return false;
  }
}
module.exports = Fan;
