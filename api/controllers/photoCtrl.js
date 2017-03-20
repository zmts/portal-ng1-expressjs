'use strict';

const express = require('express');
const router = express.Router();

const Photo = require('../models/photo');
// const auth = require('../middleware/auth');
// const sec = require('../middleware/security');

/**
 * ------------------------------
 * @BASE_URL: photos/
 * ------------------------------
 */

/**
 * ------------------------------
 * @OTHER_ROUTES
 * ------------------------------
 */
router.patch('/:id/set-best',
    setBestStatus()
);

/**
 * @BASE_ROUTES
 */
router.get('/:id',
    getPhoto()
);

/**
 * ------------------------------
 * @CONTROLLERS
 * ------------------------------
 */

/**
 * @description: get PHOTO by id
 * @hasaccess: All
 * @url GET: photos/:id
 */
function getPhoto () {
    return function (req, res) {
        Photo.getByIdAndIncrementViews(req.params.id)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

/**
 * @description: set "best" status to TRUE/FALSE
 * @url GET: photos/:id/set-best?status=true
 * @url GET: photos/:id/set-best?status=false
 */
function setBestStatus() {
    return function (req, res) {
        Photo.setBestStatus(req.params.id, req.query.status)
            .then(function (model) {
                res.json({ success: true, data: model });
            })
            .catch(function (error) {
                res.status(error.statusCode || 404).send({ success: false, description: error });
            });
    };
}

// photo removes via AlbumCtrl >> removePhotoFromAlbum controller

module.exports = router;
