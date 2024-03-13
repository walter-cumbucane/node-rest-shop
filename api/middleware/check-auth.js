const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        //Let's parse the token from the HTTP request header
        const header_value = req.headers.authorization;
        const token = header_value.split(' ')[1];

        //Let's verify to see if it is a valid token
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    } catch(e) {

        //If an error in the token verification is thrown, we send back this response
        return res.status(401).json({
            message: 'Auth Failed'
        });
    }
}