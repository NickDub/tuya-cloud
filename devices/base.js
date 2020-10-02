const debug = require('debug')('tuya-cloud');
const { get, isUndefined } = require('lodash');

/**
* A Base device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Base {
  constructor(options) {
    if (isUndefined(options.api)) {
      throw new Error('Please pass the Tuya API');
    }
    const { devicesCache, ...api } = options.api;
    this.api = api;

    if (isUndefined(options.data)) {
      throw new Error('Please pass the device data');
    }
    this.data = get(options.data, 'data');
    this.device = {
      id: get(options.data, 'id'),
      name: get(options.data, 'name'),
      type: get(options.data, 'dev_type'),
      icon: get(options.data, 'icon'),
    };
  }

  id() {
    return this.device.id;
  }

  name() {
    return this.device.name;
  }

  type() {
    return this.device.type;
  }

  iconurl() {
    return this.device.icon;
  }

  isOnline() {
    return get(this.data, 'online');
  }

  state() {
    const state = get(this.data, 'state');
    if (typeof state === 'boolean') {
      return state;
    }
    return state === 'true';
  }

  update() {
    // Avoid get cache value after control.
    return setTimeout(async () => {
      const { success, response } = await this.api._deviceControl(this.device.id, 'QueryDevice', null, 'query');
      debug(success);
      debug(response);
      if (success) {
        this.data = get(response, 'payload.data');
        return true;
      }
      return;
    }, 500);
  }

  async getSkills() {
    const state = await this.api.find({ devId: this.device.id });
    return state && state[0] && state[0].data;
  }

  async supportFeature(feature) {
    return !!this.data[feature];
    // const skills = await this.getSkills();
    // return !!skills[feature];
  }
}
module.exports = Base;
