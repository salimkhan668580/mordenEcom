const mongoose = require('mongoose');


const dbConnect = () => {
    mongoose.connect('mongodb://host.docker.internal:27017/ecommerce')
        .then(() => console.log('Database connected'))
        .catch(err => console.log(err));
}

module.exports = dbConnect;