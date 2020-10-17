'use strict';

const Dotenv = require('dotenv');
const Confidence = require('confidence');
const Toys = require('toys');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Package = require('../package.json');
const HapiPluginHeader = require('hapi-plugin-header');

// Pull .env into process.env
Dotenv.config({ path: `${__dirname}/.env` });


// Glue manifest as a confidence store
module.exports = new Confidence.Store({
    server: {
        host: 'localhost',
        port: {
            $env: 'PORT',
            $coerce: 'number',
            $default: 3002
        },
        routes: {
            security: true
        },
        debug: {
            $filter: { $env: 'NODE_ENV' },
            $default: {
                log: ['error'],
                request: ['error']
            },
            production: {
                request: ['implementation']
            }
        }
    },
    register: {
        plugins: [{
                plugin: '../lib', // Main plugin
                options: {}
            },
            {
                plugin: {
                    $filter: { $env: 'NODE_ENV' },
                    $default: 'hpal-debug',
                    production: Toys.noop
                }
            },
            {
                plugin: Inert,
                options: {}
            },
            {
                plugin: Vision,
                options: {}
            },
            {
                plugin: HapiSwagger,
                options: {
                    info: {
                        title: 'API Documentation',
                        version: Package.version
                    },
                    schemes: ['http', 'https'],
                    securityDefinitions: {
                        Bearer: {
                            type: 'apiKey',
                            name: 'Authorization',
                            in: 'header',
                            'x-keyPrefix': 'Bearer '
                        }
                    },
                    security: [{ Bearer: [] }],
                    deReference: false,
                    cache: {
                        expiresIn: 24 * 60 * 60 * 1000
                    }
                }
            },
            {
                plugin: HapiPluginHeader,
                options: {
                    'X-Dns-Prefetch-Control': 'off'
                }
            },
{
                plugin: 'schwifty',
                options: {
                    $filter: 'NODE_ENV',
                    $default: {},
                                $base: {
                        migrateOnStart: true,
                        knex: {
                            client: 'mysql',
                            connection: {
                                host: process.env.MYSQL_DB_HOST,
                                user: process.env.MYSQL_DB_USER,
                                password: process.env.MYSQL_DB_PASS,
                                database: process.env.MYSQL_DB_NAME
                            }
                        }
                    },
                    production: {
                        migrateOnStart: false
                    }
                }
            }
        ]
    }
});