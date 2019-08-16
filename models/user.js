
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');

const userSchema = new mongoose.Schema({
    // first_name: {
    //     type: String,
    //     required: 'First name is required',
    //     trim: true
    // },
    // surname: {
    //     type: String, 
    //     required: 'kj',
    //     trim: true
    // },
    email: {
        type: String,
        required: 'Email address is required',
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: 'Password is required',
        bcrypt: true
    },
    isAdmin: {
        type: Boolean,
        default: true
    }
});


// username field requires email to log in 
// bycrpt salts password
userSchema.plugin(mongooseBcrypt);
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);