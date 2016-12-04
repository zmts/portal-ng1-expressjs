'use strict';

var express = require('express'),
    fs = require('fs'),
    router = express.Router(),
    User = require('../models/user'),
    auth = require('../middleware/auth');

/**
 * baseUrl: user/
 */
router.get('/help',         help()); // Sends help route
router.get('/all',          readAll()); // Show list of all items
router.get('/:id/posts',    auth.checkToken(), readPosts()); // Show list of all posts related by user id
router.post('/',            auth.hashPassword(), create()); // Create user
router.get('/:id',          read()); // Display item by id
router.put('/:id',          update()); // Update item details by id
router.delete('/:id',       remove()); // Delete item by id

/**
 * ------------------------------
 * description: check User name availability
 * ------------------------------
 * url: user/checkNameAvailability
 * method: POST
 * request: {"name": "string"}
 * response: true if found, false if not found
 */
router.post('/checkNameAvailability', auth.checkNameAvailability(), function (req, res) {
    res.json({success: true, message: 'Found'});
});

/**
 * ------------------------------
 * description: check User email availability
 * ------------------------------
 * url: user/checkEmailAvailability
 * method: POST
 * request: {"email": "string"}
 * response: true if found, false if not found
 */
router.post('/checkEmailAvailability', auth.checkEmailAvailability(), function (req, res) {
    res.json({success: true, message: 'Found'});
});

/**
 * ------------------------------
 * description: User sign in(login) system
 * ------------------------------
 * url: user/signin
 * method: POST
 * request: {"email": "string", password: "string"}
 */
router.post('/signin', auth.checkEmailAvailability(), auth.checkPassword(), auth.makeToken());

/**
 * ------------------------------
 * description: User sign out(logout) system
 * ------------------------------
 * url: user/signout
 * method: POST
 * request: {"email": "string"}
 */
router.post('/signout', auth.signOut());

/********** end routes **********/
/********** end routes **********/
/********** end routes **********/

/**
 * @api public
 * ------------------------------
 * description: help
 * ------------------------------
 * url: user/help
 * method: GET
 */
function help() {
    return function(req, res) {
        // var str = fs.readFileSync(__filename, 'utf8');
        res.send('User route help info');
    }
}

/**
 * ------------------------------
 * description: get all Users
 * ------------------------------
 * url: user/all
 * method: GET
 */
function readAll() {
    return function(req, res) {
        User.fetchAll({require: true})
            .then(function(list) {
                // console.log(list.serialize())
                res.json(list);
            })
            .catch(function(error) {
                res.status(400).send(error);
            });
    }
}

/**
 * ------------------------------
 * description: show list of all Posts related by User id
 * ------------------------------
 * url: user/user_id/posts
 * method: GET
 */
function readPosts() {
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                User.getPosts(user.id)
                    .then(function (list) {
                        res.json({success: true, data: list.related('posts')});
                    })
                    .catch(function (error) {
                        res.status(400).send(error);
                    });
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: create new User(Registration)
 * ------------------------------
 * url: user/
 * method: POST
 * request: {"name": "string", "email": "string", "password_hash": "string"}
 */
function create() {
    return function(req, res) {
        User.create(req.body)
            .then(function (model) {
                res.json(model);
            }).catch(function (error) {
                res.status(400).send(error);
            });
    }
}

/**
 * ------------------------------
 * description: get User by id
 * ------------------------------
 * url: user/:id
 * method: GET
 */
function read() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function(user) {
                    res.json({success: true, data: user});
            }).catch(function(error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: update User by id
 * ------------------------------
 * url: user/:id
 * method: PUT
 * request: {"name": "string", "email": "string"}
 */
function update() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                User.update(user.id, req.body)
                    .then(function (data) {
                        res.json({success: true, data: data});
                    }).catch(function (error) {
                        res.status(400).send(error);
                    });
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: remove User from db by id
 * ------------------------------
 * url: user/:id
 * method: DELETE
 */
function remove() {
    return function(req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                User.remove(model.id)
                    .then(function () {
                        res.json({success: true, message: 'User id ' + model.id + ' was removed'});
                    }).catch(function (error) {
                        res.status(400).send(error);
                    });

            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

module.exports = router;
