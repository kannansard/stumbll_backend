'use strict';

const Toys = require('toys');

exports.withDefaults = Toys.withRouteDefaults({
    options: {
        cors: true,
        validate: {
            failAction: (request, h, err) => {

                throw err;
            }
        }
    }
});
