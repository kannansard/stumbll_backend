'use strict';

const JwksRsa = require('jwks-rsa');

const aud = [
    'https://dev-api.doocti.com',
    'https://dev-doocti.au.auth0.com/userinfo',
    'https://dev-doocti.au.auth0.com/api/v2/'
];

module.exports = (server, options) => ({

    scheme: 'jwt',
    options: {
        complete: true,
        key: JwksRsa.hapiJwt2KeyAsync({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 30,
            jwksUri: 'https://dev-doocti.au.auth0.com/.well-known/jwks.json'
        }),
        verifyOptions: {
            audience: aud,
            issuer: 'https://dev-doocti.au.auth0.com/',
            algorithms: ['RS256']
        },
        validate: (decoded, request) => {

            if (decoded && decoded.sub) {
                return decoded.scope ? {
                    isValid: true,
                    credentials: {
                        scope: decoded.scope.split(' '),
                        decoded
                    }
                } : { isValid: true };
            }

            return { isValid: false };
        }
    }
});
