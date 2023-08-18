const jwt = require('jsonwebtoken');


//middleware function is executed on the incoming request
//to protect certain routes agains unathenticated access
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };//every middlware running after checauth middleware will get this extra piece of info
        next();//if it doensnt fail, next works, as response
    }
    catch (error) {
        res.status(401).json({ message: "Auth failed" });
    }


}
