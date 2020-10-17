'use strict';

const Joi = require('@hapi/joi');
const { Model } = require('./helpers');

module.exports = class User extends Model {

    static get tableName() {

        return 'users';
    }

    static get joiSchema() {

        return Joi.object({
            id: Joi.number().integer().greater(0),
            created_at: Joi.date(),
            updated_at: Joi.date(),
            first_name: Joi.string(),
            last_name: Joi.string(),
            email_id: Joi.string().email(),
            user_name: Joi.string()
        });
    }

};