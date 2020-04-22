const bcrypt = require('bcryptjs');

async function verifiedPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}


module.exports = verifiedPassword;