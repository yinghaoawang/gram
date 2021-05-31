const jwt = require("jsonwebtoken");
const config = require('../config/config');

const accessTokenSecret = config.jwt.secret;

const authenticateJWT = async (req, res, next) => {
    try {
        //const authHeader = req.headers.authorization;
        console.log('cookie tokens', req.cookies.token);
        //console.log('authHeader', authHeader)
        //if (authHeader) {
            //const token = authHeader.split(' ')[1];
        const token = req.cookies.token;
        if (token) {
            let user = await jwt.verify(token, accessTokenSecret);
            console.log('user', user);
            if (user != null) {
                req.user = user;
            }
        }
        next();
    } catch (e) {
        res.clearCookie('token');
        console.error('auth error, auth token cleared', e.message);
        res.status(400).send('Auth token expired');
        //next();
    }


};

module.exports = {
    authenticateJWT
};