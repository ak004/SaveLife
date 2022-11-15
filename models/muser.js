const mongoose        = require('mongoose');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    id: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
});

const MUser = mongoose.model('MUser', userSchema);

module.exports = MUser
