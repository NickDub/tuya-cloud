const { get } = require('lodash');
const Base = require('./base');

/**
* A Light device
* @class
* @param {Object} options construction options
* @param {Object} options.api Tuya API
* @param {Object} options.data Device data
* */
class Light extends Base {
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

  /* Brightness */
  async supportBrightness() {
    return await this.supportFeature('brightness');
  }

  async getBrightness() {
    const workMode = get(this.data, 'color_mode');
    if (workMode === 'colour' && get(this.data, 'color')) {
      // Converts string to number and calculates to percentage
      return Number(parseInt(get(this.data, 'color.brightness'), 10) * 255 / 100).toFixed(0);
    } else {
      return parseInt(get(this.data, 'brightness'), 10);
    }
  }

  async setBrightness(brightness) {
    // Set the brightness(0-255) of light
    await this.api._deviceControl(this.device.id, 'brightnessSet', { value: parseInt(brightness * 100 / 255, 10) });
  }

  /* Color*/
  async supportColor() {
    return await this.supportFeature('color');
  }

  async getColor() {
    const color = get(this.data, 'color');
    if (color) {
      return color;
    }
    return;
  }

  async setColor(color) {
    const hsvColor = {};
    hsvColor.hue = color.hue;
    hsvColor.saturation = parseInt(color.saturation / 100, 10);
    if (color.brightness) {
      hsvColor.brightness = color.brightness;
    } else {
      hsvColor.brightness = parseInt(this.getBrightness() / 255, 10);
    }
    // Color white
    if (hsvColor.saturation === 0) {
      hsvColor.hue = 0;
    }
    await this.api._deviceControl(this.device.id, 'colorSet', { color: hsvColor });
  }

  /* Color Temp */
  async supportColorTemp() {
    return await this.supportFeature('color_temp');
  }

  async getColorTemp() {
    const colorTemp = get(this.data, 'color_temp');
    if (colorTemp) {
      return colorTemp;
    }
    return;
  }

  async setColorTemp(colorTemp) {
    // Set the color temp (10000-1000) of light
    await this.api._deviceControl(this.device.id, 'colorTemperatureSet', { value: colorTemp });
  }

  getHsColor() {
    const color = get(this.data, 'color');
    if (color) {
      const hsColor = { hue: 0, saturation: 0 };
      const workMode = get(this.data, 'color_mode');
      if (workMode === 'colour') {
        hsColor.hue = get(this.data, 'color.hue');
        hsColor.saturation = get(this.data, 'color.saturation');
      }
      return hsColor;
    }
    return;
  }
}
module.exports = Light;
