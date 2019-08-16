// require model
const User = require('../models/user');
const Passport = require('passport');

// Express validator
const { check, validationResult } = require('express-validator');
const { sanitize } = require('express-validator');

exports.isAdmin = (request, response, next) => {
    // is admin function from user.js
    if (request.isAuthenticated() && request.user.isAdmin){
        next();
        return;
    } else {
        request.flash('error', 'You must be logged in as Admin to access this page');
        response.redirect('/');
    }
}

exports.signUpGet = (request, response) => {
    response.render('signUp', {title: 'Sign Up' });
}

exports.signUpPost = [
    // Validate User Data, ensure safe data is passed to server
    check('email').isEmail().withMessage('Invald email address'),

    check('password').isLength({ min: 6 }).withMessage('Invalid password, password must be at least 6 characters'),

    check('confirm_password').custom((value, {req}) => value===req.body.password).withMessage('Passwords do not match'),

    // escape() function removes any html errors for safety
    sanitize('*').trim().escape(),

    (request, response, next) => {
        const errors = validationResult(request);

        if(!errors.isEmpty()){
            // if errors exist
            response.render('signUp', {title: 'Sign Up', message: 'Please fix the following errors: ', errors: errors.array()});
            return;
        } 
        else {
            // if no errors
            const newUser = new User(request.body);
            // user, password, callback function
            User.register(newUser, request.body.password, function(error){
                if(error){
                    console.log('error while registering', error);
                    return next(error);
                }
                request.flash('success', 'You have successfully registered new admin');
                next(); // moves to login post
            });
        }
    }

]

exports.loginGet = (request, response) => {
    response.render('login', {title: 'Log in to continue'});
}

exports.loginPost = Passport.authenticate('local', {
    successRedirect: '/',
    successFlash: 'You are now logged in',
    failureRedirect: '/login',
    failureFlash: 'Log in failed, please try again'
})

exports.logout = (request, response) => {
    request.logout();
    request.flash('info', 'You are now logged out');
    response.redirect('/');
}

exports.adminPageGet = (request, response) => {
    response.render('admin-page',{title: 'Add/Edit/Remove TMDL or add Admin'})
}