'use strict';

const Schmervice = require('schmervice');
const Boom = require('@hapi/boom');
const Moment = require('moment');

module.exports = class UserService extends Schmervice.Service {

    async (payload) {

        let response = {
            'statusCode': 201,
            'message': 'Created',
            'data': undefined
        };

        const { User } = this.server.models();

        return User.query().insert(payload).then(function(rows) {
            console.log(rows);
            response.data = rows;
            return response;
        }).catch(error => {
            console.log(error);
            if (error.nativeError) {
                if (error.nativeError.name == 'error') {
                    response.errorMessage = { "user_key_error": error.nativeError.detail };
                    return response;
                }
            }
        });
    }


};