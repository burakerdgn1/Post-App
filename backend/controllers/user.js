const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash

        });

        //save user to the database
        user.save().then(result => {
            res.status(201).json({ message: "User created", result: result });
        }).
            catch(err => {
                res.status(500).json({
                    message: "Invalid authentication credentials",
                });
            });
    });
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if (!user) {//if no user with that email adress
            return res.status(401).json({ message: "Auth failed, no user found with the email address" });
        }
        fetchedUser = user;


        return bcrypt.compare(req.body.password, user.password);
    }).then(result => {
        if (!result) {
            return res.status(401).json({ message: "Auth failed" });
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, process.env.JWT_KEY, { expiresIn: '1h' });
        return res.status(200).json({ token: token, expiresIn: 3600, userId: fetchedUser._id });//we pass information to the client 


    }).catch(err => {
        return res.status(401).json({ message: "You are not authenticated!" });
    })
}

