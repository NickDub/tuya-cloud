const Base = require('./base');

/**
* A Scene device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Scene extends Base {
  available() {
    return true;
  }

  async activate() {
    await this.api._deviceControl(this.device.id, 'turnOnOff', { value: '1' });
  }

  update() {
    return true;
  }
}
module.exports = Scene;
