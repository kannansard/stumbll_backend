'use strict';

const HauteCouture = require('haute-couture');
const Package = require('../package.json');

exports.plugin = {
    pkg: Package,
    register: async (server, options) => {
        server.settings.app = {};
        await HauteCouture.using()(server, options);
    }
};