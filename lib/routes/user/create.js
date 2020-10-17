'use strict';

const Helpers = require('../helpers');
const Joi = require('@hapi/joi');
const Uuid = require('uuid');
const Xss = require('xss');
const Boom = require('@hapi/boom');

const { v1: Uuidv1 } = Uuid;

module.exports = Helpers.withDefaults({
    method: 'post',
    path: '/user',
    options: {
        validate: {
            payload: Joi.object({
                first_name: Joi.string().required(),
                last_name: Joi.string().allow('').optional(),
                user_name: Joi.string().required(),
                email_id: Joi.string().required()
            })
        },
        description: 'Create User',
        tags: ['api', 'v1', 'create', 'user'],
        auth: false,
        // auth: {
        //     strategy: 'jwt',
        //     access: [{
        //         scope: ['profile']
        //     }]
        // },
        handler: async (request, h) => {

            try {
                request.payload = JSON.parse(Xss(JSON.stringify(request.payload)));
            } catch (err) {
                const error = Boom.badRequest('Invalid Input');
                return error;
            }

            const { userService } = request.services();
            const output = await userService.create(request.payload);
            console.log(output);
            if (output.statusCode === 201) {
                const response = h.response(output);
                response.code(201);
                return response;
            } else {
                return output;
            }
        }
    }
});