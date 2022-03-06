const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: true,
        unique: true
    },
    userpassword: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);


module.exports = mongoose.model('Users', userSchema);



