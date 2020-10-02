const { find, get } = require('lodash');
const Base = require('./base');

/**
* A Cover device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Cover extends Base {
  state() {
    return get(this.data, 'state');
  }

  async openCover() {
    const { success } = await this.api._deviceControl(this.device.id, 'turnOnOff', { 'value': '1' });
    if (success) {
      this.data.state = true;
    }
  }

  async closeCover() {
    const { success } = await this.api._deviceControl(this.device.id, 'turnOnOff', { 'value': '0' });
    if (success) {
      this.data.state = false;
    }
  }

  async stopCover() {
    await this.api._deviceControl(this.device.id, 'startStop', { 'value': '0' });
  }

  supportStop() {
    return this.supportFeature('support_stop');
  }
}
module.exports = Cover;
