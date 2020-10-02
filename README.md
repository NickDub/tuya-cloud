# Tuya Cloud

![Node Version](https://img.shields.io/badge/node-%3E=8-blue.svg)

Node.js API for Tuya control over the cloud.

This Node.js API allows you to discover and control your Tuya / Smart Life / Jinvoo Smart devices which related to your account, by just passing your account information (username, password and account country code).

This library is based on the [Home Assistant](https://www.home-assistant.io/integrations/tuya/) implementation. Tuya has an undocumented API for HA that differs from the official API. Because this API is undocumented and differs, it's unclear what is supported and not. The devices that are supported in HA implementation are for now possible to support.

A good reference of the capibilities is the [tuyaha project](https://github.com/PaulAnnekov/tuyaha), which actually is a library, written in python.

## Devices
### Supported devices
- **Climate** - The platform supports the air conditioner and heater.
- **Cover** - The platform supports curtains.
- **Fan** - The platform supports most kinds of Tuya fans.
- **Light** - The platform supports most kinds of Tuya light.
- **Scene** - The device state in frontend panel will not change immediately after you activate a scene.
- **Switch** - The platform supports switch and socket.

### Possible supported devices
- Ledstrip
- Lock
- Switch with energy monitoring

## TODO
```javascript
{
  "userName": "YOUR_TUYA_EMAIL",
  "password": "YOUR_TUYA_PASSWORD",
  "bizType": "tuya",
  "countryCode": "33",
  "region": "eu"
}
```
The following values are available

- **bizType**: *tuya, smart_life or jinvoo_smart*
- **countryCode**: Enter the [country calling code](https://en.wikipedia.org/wiki/List_of_country_calling_codes) from your country, e.g. 44
- **region**: *ay* (Asia), *az* (West US), *ueaz* (East US), *eu* (Europe), *in* (India)