const { get } = require('lodash');
const Base = require('./base');

/**
* A Climate device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Climate extends Base {
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

  /* Operation Mode */
  async supportOperationMode() {
    return await this.supportFeature('mode');
  }

  async getOperationMode() {
    return (await this.getSkills())['mode'];
  }

  async getOperationList() {
    return (await this.getSkills())['support_mode'];
  }

  async setOperationMode(operationMode) {
    // Set new target operation mode
    // const { success, response } = await this.api._deviceControl(this.device.id, 'modeSet', { value: operationMode});
    await this.api._deviceControl(this.device.id, 'modeSet', { value: operationMode});
  }

  async setSwingMode(swingMode) {
    throw new Error('Not yet implemented!');
  }

  /* Fan Mode */
  async supportFanMode() {
    return await this.supportFeature('windspeed');
  }

  getFanModeList() {
    return ['low', 'medium', 'high'];
  }

  async getFanMode() {
    const fanSpeed = (await this.getSkills())['windspeed'];
    switch (fanSpeed) {
      case 1: return 'low';
      case 2: return 'medium';
      case 3: return 'high';
      default:
        throw new Error('Not yet implemented!');
    }
  }

  async setFanMode(fanMode) {
    // Set new target fan mode
    // const { success, response } = await this.api._deviceControl(this.device.id, 'windSpeedSet', { value: fanMode});
    await this.api._deviceControl(this.device.id, 'windSpeedSet', { value: fanMode});
  }

  /* Temperature */
  async supportTemperature() {
    return await this.supportFeature('temperature');
  }

  getTemperatureUnit() {
    return get(this.data, 'temp_unit');
  }

  async getCurrentTemperature() {
    return (await this.getSkills())['current_temperature'];
    // return get(this.data, 'current_temperature');

  }

  async getTargetTemperature() {
    return (await this.getSkills())['temperature'];
    // return get(this.data, 'temperature');

  }
  
  getMinTemp() {
    return get(this.data, 'min_temper');
  }

  getMaxTemp() {
    return get(this.data, 'max_temper');
  }

  async setTemperature(temperature) {
    // Set new target temperature
    // const { success, response } = await this.api._deviceControl(this.device.id, 'temperatureSet', { value: temperature});
    await this.api._deviceControl(this.device.id, 'temperatureSet', { value: temperature});
  }

  /* Humidity */
  async supportHumidity() {
    return await this.supportFeature('humidity');
  }

  getHumidity() {
    throw new Error('Not yet implemented!');
  }

  setHumidity(humidity) {
    throw new Error('Not yet implemented!');
  }
}
module.exports = Climate;
