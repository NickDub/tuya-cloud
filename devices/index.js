const debug = require('debug')('tuya-cloud');
var { get } = require('lodash');
var Climate = require('./climate');
var Cover = require('./cover');
var Fan = require('./fan');
var Light = require('./light');
var Lock = require('./lock');
var Scene = require('./scene');
var Switch = require('./switch');

/**
* A TuyaDevice object
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class TuyaDevice {
  constructor(options) {
    debug(options);
    switch (get(options.data, 'dev_type')) {
      case 'climate': return new Climate(options);
      case 'cover': return new Cover(options);
      case 'fan': return new Fan(options);
      case 'light': return new Light(options);
      case 'lock': return new Lock(options);
      case 'scene': return new Scene(options);
      case 'switch': return new Switch(options);
      default:
        throw new Error('Not yet implemented!');
    }
  }
}
module.exports = TuyaDevice;
