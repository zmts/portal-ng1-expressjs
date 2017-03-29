'use strict';

const express = require('express');
const router = express.Router();

const User = require('../models/user');
const auth = require('../middleware/auth');
const sec = require('../middleware/security');

/**
 * ------------------------------------------------------------
 * @BASE_URL: users/
 * ------------------------------------------------------------
 */

/**
 * ------------------------------------------------------------
 * @OTHER_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description change User Role
 * @hasaccess SU
 * @request {user_id: "role"}
 */
// router.post('/:id/change-user-role',
//     sec.checkSUAccess(),
//     changeUserRole()
// );

/**
 * @description check User name availability
 * @hasaccess: All
 */
router.get('/check-name-availability',
    checkNameAvailability()
);

/**
 * @description check User email availability
 * @hasaccess All
 */
router.get('/check-email-availability',
    checkEmailAvailability()
);

/**
 * ------------------------------------------------------------
 * @RELATED_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @return ADMINROLES or OWNER >> all mix POSTs by user_id
 * @return Anonymous or NotOwner >> all public POST's by user_id
 */
router.get('/:id/posts/',
    auth.checkToken(),
    sec.checkOwnerIdInParams(),
    getPostsByUserId()
);

/**
 * ------------------------------------------------------------
 * @BASE_ROUTES
 * ------------------------------------------------------------
 */

/**
 * @description get all Users
 * @url GET: users/
 * @hasaccess All
 */
router.get('/',
    getAllUsers()
);

/**
 * @return Owner >> all profile data
 * @return Anonymous or NotOwner >> only public profile data TODO
 */
router.get('/:id',
    getUser()
);

/**
 * @description create new User(Registration)
 * @hasaccess only Anonymous
 * @request {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
router.post('/',
    auth.hashPassword(),
    newUser()
);

/**
 * @description update User by id
 * @hasaccess OWNER, ADMINROLES
 * @request {"name": "string", "email": "string", "password": "string"}
 * "password" field from request transfers and saves to DB as "password_hash"
 */
router.patch('/:id',
    auth.checkToken(),
    sec.checkUserProfileAccess(),
    auth.hashPassword(),
    update()
);

/**
 * @description remove User from db by id
 * @hasaccess OWNER, ADMINROLES
 */
router.delete('/:id',
    auth.checkToken(),
    sec.checkUserProfileAccess(),
    remove()
);

/**
 * ------------------------------------------------------------
 * @CONTROLLERS
 * ------------------------------------------------------------
 */

function getAllUsers() {
    return function (req, res) {
        User.GETall()
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function getPostsByUserId() {
    return function (req, res) {
        User.getPostsByUserIdAccessSwitcher(req.params.id, req.body.helpData.isOwner)
            .then(function (list) {
                res.json({ success: true, data: list });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function newUser() {
    return function (req, res) {
        delete req.body.helpData;
        User.CREATE(req.body)
            .then(function (user) {
                res.json(user);
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function getUser() {
    return function (req, res) {
        User.GETbyId(req.params.id)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function update() {
    return function (req, res) {
        delete req.body.helpData;
        User.UPDATE(req.params.id, req.body)
            .then(function (updated_user) {
                res.json({ success: true, data: updated_user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function remove() {
    return function (req, res) {
        User.REMOVE(req.params.id)
            .then(function () {
                res.json({ success: true, description: 'User #'+ req.params.id +' was removed' });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function checkNameAvailability() {
    return function (req, res) {
        User.getByName(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

function checkEmailAvailability() {
    return function (req, res) {
        User.getByEmail(req.query.q)
            .then(function (user) {
                res.json({ success: true, data: user });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error.message || error });
            });
    };
}

// function changeUserRole() { // TODO
//     return function (req, res) {
//         res.json({success: true});
//     }
// }

module.exports = router;
