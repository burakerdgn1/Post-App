const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');




const app = express();


mongoose.connect('mongodb+srv://burakerdogan749:' + process.env.MONGO_ATLAS_PW + '@cluster0.duyedw4.mongodb.net/mean?retryWrites=true&w=majority').then(
    () => {
        console.log('Connected to DB');
    },
).catch((error) => {
    console.log('Error : ' + error.message);

});

//milddlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));


app.get('/favicon.ico', (req, res, next) => res.status(204).end());

//setting headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS');
    next();//response
})

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

app.use("/", express.static(path.join(__dirname, "../dist/mean-test")));

app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, "../dist/mean-test/index.html"));
});




module.exports = app;