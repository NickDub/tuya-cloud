const { get, isUndefined } = require('lodash');
const Base = require('./base');

/**
* A Lock device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Lock extends Base {
  state() {
    const state = get(this.data, 'state');
    if (isUndefined(state)) {
      return;
    }
    return state === 'true';
  }
}
module.exports = Lock;
