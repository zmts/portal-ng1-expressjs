'use strict';

var express = require('express');
var fs = require('fs');
var router = express.Router();

var User = require('../models/user');
var auth = require('../middleware/auth');
var validateReqId = require('../middleware/validateRequest').validateReqId;
var validateReqBody = require('../middleware/validateRequest').validateReqBody;

/**
 * baseUrl: user/
 */
router.get('/all',          readAll()); // Show list of all items
router.get('/:id/posts',    auth.checkToken(), readPosts()); // Show list of all posts related by user id

router.post('/',            validateReqBody(), auth.hashPassword(), create()); // Create user
router.get('/:id',          validateReqId(), read()); // Display item by id
router.put('/:id',          validateReqId(), validateReqBody(), update()); // Update item details by id
router.delete('/:id',       validateReqId(), remove()); // Delete item by id

router.post('/checkNameAvailability', validateReqBody(), checkNameAvailability());
router.post('/checkEmailAvailability', validateReqBody(), checkEmailAvailability());

/**
 * ------------------------------
 * description: get all Users
 * ------------------------------
 * url: user/all
 * method: GET
 */
function readAll() {
    return function (req, res) {
        User.getAll()
            .then(function (list) {
                res.json({success: true, data: list});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: show list of all Posts related by User id
 * ------------------------------
 * url: user/user_id/posts
 * headers: token
 * method: GET
 */
function readPosts() {
    return function (req, res) {
        User.getPosts(req.params.id)
            .then(function (list) {
                res.json({success: true, data: list.related('posts')});
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
    return function (req, res) {
        User.create(req.body)
            .then(function (user) {
                res.json(user);
            }).catch(function (error) {
                res.status(400).send({success: false, description: error});
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
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                res.json({success: true, data: user});
            }).catch(function (error) {
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
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (user) {
                User.update(user.id, req.body)
                    .then(function (updated_user) {
                        res.json({success: true, data: updated_user});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
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
    return function (req, res) {
        User.getById(req.params.id)
            .then(function (model) {
                User.remove(model.id)
                    .then(function () {
                        res.json({success: true, description: 'User id ' + model.id + ' was removed'});
                    }).catch(function (error) {
                        res.status(400).send({success: false, description: error});
                    });
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: check User name availability
 * ------------------------------
 * url: user/checkNameAvailability
 * method: POST
 * request: {"name": "string"}
 * response: true if found, false if not found
 */
function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.body.name)
            .then(function (user) {
                res.json({success: true});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

/**
 * ------------------------------
 * description: check User email availability
 * ------------------------------
 * url: user/checkEmailAvailability
 * method: POST
 * request: {"email": "string"}
 * response: true if found, false if not found
 */
function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.body.email)
            .then(function (user) {
                res.json({success: true});
            }).catch(function (error) {
                res.status(404).send({success: false, description: error});
            });
    }
}

module.exports = router;
