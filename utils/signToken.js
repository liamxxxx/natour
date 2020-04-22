const jwt = require('jsonwebtoken');

const signToken = async(id) => {
    return jwt.sign(id, 'MYSECRETAPP');
}

module.exports = signToken;