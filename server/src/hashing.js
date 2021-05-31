const bcrypt = require('bcrypt');
const saltRounds = 10;

let hashPassword = async (ptPassword) => {
    try {
        let hashedPassword = await bcrypt.hash(ptPassword, saltRounds);
        return hashedPassword;
    } catch(e) {
        console.error("failed to hash password", e.message);
        return null;
    }
}

let checkPassword = async (ptPassword, hashedPassword) => {
    try {
        let res = await bcrypt.compare(ptPassword, hashedPassword);
        return res;
    } catch(e) {
        console.error("failed to check password", e.message);
        return false;
    }
}

module.exports = {
    checkPassword, hashPassword
}