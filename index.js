const axios = require('axios');
const debug = require('debug')('tuya-cloud');
const { filter, find, get, isUndefined } = require('lodash');
const querystring = require('querystring');
const util = require('util');
const TuyaDevice = require('./devices/index');

const TUYA_CLOUD_URL_FORMAT = 'https://px1.tuya%s.com/homeassistant';
const KNOWN_REGIONS = ['cn', 'eu', 'us'];
const KNOWN_BIZ_TYPES = ['tuya', 'smart_life', 'jinvoo_smart'];
const REFRESHTIME = 60 * 60 * 12;

/**
* A TuyaCloud object
* @class
* @param {Object} options construction options
* @param {String} options.userName App email to login to App on phone
* @param {String} options.password App password
* @param {String} [options.bizType='tuya'] App business ('tuya', 'smart_life' or 'jinvoo_smart')
* @param {String} [options.countryCode='33'] Country code (International dialing number, see: https://www.countrycode.org/)
* @param {String} [options.region='eu'] region cn=Asia, eu=Europe, us=Americas)
* */
class TuyaCloud {
  constructor(options) {
    const config = options || {};
    if (isUndefined(config.userName) || isUndefined(config.password)) {
      throw new Error('Missing loging email/pass');
    } else {
      const bizType = config.bizType && KNOWN_BIZ_TYPES.includes(config.bizType.toLowerCase()) ? config.bizType.toLowerCase() : 'tuya';
      this.loginData = {
        userName: config.userName,
        password: config.password,
        countryCode: config.countryCode || '33',
        bizType,
        from: 'tuya'
      };
    }
    this.region = config.region && KNOWN_REGIONS.includes(config.region.toLowerCase()) ? config.region.toLowerCase() : 'eu';

    // Specific endpoint where no key/secret required
    this.uri = util.format(TUYA_CLOUD_URL_FORMAT, this.region);

    // Set to empty object if undefined
    this.session = {
      accessToken: '',
      refreshToken: '',
      expireIn: 0,
      uri: util.format(TUYA_CLOUD_URL_FORMAT, this.region)
    };

    this.devicesCache = [];
  }

  async discoverDevices() {
    debug('Discover devices');
    const response = await this._request('Discovery', 'discovery');
    debug(response);
    if (response.status_code >= 500) {
      throw new Error(response);
    }
    if (response && response.header.code === 'SUCCESS') {
      const devices = get(response, 'payload.devices');
      if (devices) {
        this.devicesCache = devices.map(device => new TuyaDevice({ api: this, data: device }));
      }
      return this.devicesCache;
    }
  }

  getDevices() {
    return this.devicesCache;
  }

  getDeviceById(devId) {
    return find(this.devicesCache, (device) => { return device.id() === devId });
  }

  getDevicesByType(devType) {
    return filter(this.devicesCache, { dev_type: devType });
  }

  async login() {
    if (this.loginData.username == '' || this.loginData.password == '') {
      throw new Error('Missing loging email/pass');
    }
    if (this.session.accessToken === '' || this.session.refreshToken === '') {
      await this._getAccessToken();
    } else if (this.session.expireIn <= REFRESHTIME + int(time.time())) {
      await this._refreshAccessToken();
    }
  }

  async _getAccessToken() {
    const uri = `${this.uri}/auth.do`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const data = querystring.stringify(this.loginData);
    const response = await axios.post(uri, data, headers);
    debug(response);
    if (response.status_code >= 500) {
      throw new Error(response);
    }
    if (response && response.data) {
      this._getTokens(response);
    }
  }

  async _refreshAccessToken() {
    const uri = `${this.uri}/access.do?grant_type=refresh_token&refresh_token=${this.refreshToken}`;
    const response = await axios.get(uri);
    debug(response);
    if (response.status_code >= 500) {
      throw new Error(response);
    }
    if (response && response.data) {
      this._getTokens(response);
    }
  }

  _getTokens(response) {
    this.session.accessToken = get(response.data, 'access_token');
    this.session.refreshToken = get(response.data, 'refresh_token');
    this.session.expiresIn = get(response.data, 'expires_in');
    switch (this.session.accessToken.substring(0, 2)) {
      case 'AY':
        this.region = 'cn';
        break;
      case 'EU':
        this.region = 'eu';
        break;
      default:
        this.region = 'us';
        break;
    }
    this.session.uri = util.format(TUYA_CLOUD_URL_FORMAT, this.region);
  }

  async _deviceControl(devId, action, param = undefined, namespace = 'control') {
    debug('Device control');
    if (isUndefined(param)) {
      param = {};
    }
    const response = await this._request(action, namespace, devId, param);
    debug(response);
    const success = (response && response.header.code === 'SUCCESS') ? true : false;
    return { success, response };
  }

  async _request(name, namespace, devId = undefined, payload = {}) {
    const uri = `${this.session.uri}/skill`;
    const headers = { 'Content-Type': 'application/json' };
    payload.accessToken = this.session.accessToken;
    if (namespace != 'discovery') {
      payload.devId = devId;
    }
    const data = { header: { name, namespace, payloadVersion: 1 }, payload };
    const response = await axios.post(uri, data, headers);
    debug(response);
    if (isUndefined(response.data) && isUndefined(response.data.ok)) {
      debug(`Request error, status code is ${response.status_code}, device ${devId}`);
      return;
    }
    if (response.data.header && response.data.header.code != 'SUCCESS') {
      debug(`Control device error, error code is ${response.header.code}`);
    }
    return response.data;
  }
}
module.exports = TuyaCloud;
