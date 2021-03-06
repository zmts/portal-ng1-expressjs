'use strict';

const fse = require('fs-extra');
const Joi = require('joi');

const MainModel = require('./main');
const Comment = require('./comment');
const PHOTO_DIR = require('../config/').photoDir;

/**
 * @model
 * id
 * album_id
 * user_id
 * views
 * updated_at
 * created_at
 * best
 * filename
 * _src
 * _thumbnail_mid
 * _thumbnail_low
 */

class Photo extends MainModel {
    static get tableName() {
        return 'photos';
    }

    static get relationMappings() {
        return {
            comments: {
                relation: MainModel.HasManyRelation,
                modelClass: __dirname + '/comment',
                filter: { type: 'photo' },
                join: {
                    from: 'photos.id',
                    to: 'comments.entity_id'
                }
            }
        };

    }
}

/**
 * ------------------------------
 * @VALIDATION_RULES
 * ------------------------------
 */

Photo.rules = {
    CreateUpdate: {
        body: Joi.object().keys({
            user_id: Joi.number().integer().required(),
            album_id: Joi.number().integer().required(),
            filename: Joi.string().min(10).max(500).required(),
            best: Joi.boolean()
        })
    },
    SetBest: {
        query: Joi.object().keys({
            status: Joi.boolean().required()
        })
    }
};

/**
 * ------------------------------
 * @VIRTUAL_ATTRIBUTES
 * ------------------------------
 */
Photo.virtualAttributes = [
    '_src',
    '_thumbnail_mid',
    '_thumbnail_low'
];

Photo.prototype._src = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/src/${this.filename}`;
};

Photo.prototype._thumbnail_mid = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/thumbnail-mid/${this.filename}`;
};

Photo.prototype._thumbnail_low = function () {
    return `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}/photos/uid-${this.user_id}/${this.album_id}/thumbnail-low/${this.filename}`;
};

/**
 * ------------------------------
 * @HOOKS
 * ------------------------------
 */

Photo.prototype.$beforeInsert = function (/*json*/) {
    // this.$validate();
};

Photo.prototype.$beforeUpdate = function () {
    this.updated_at = new Date().toISOString();
    // this.$validate();
};

/**
 * ------------------------------
 * @METHODS
 * ------------------------------
 */

/**
 * @description get Photo by Id and Update views counter
 * @param id
 * @return model with updated views counter
 */
Photo.getByIdAndIncrementViews = function (id) {
    return this.query()
        .findById(id)
        .eager('comments')
        .modifyEager('comments', builder => {
            builder.orderBy('created_at');
        })
        .increment('views', 1)
        .returning('*')
        .then(data => {
            if (!data) throw { message: 'Empty response', status: 404 };
            return data;
        })
        .catch(error => {
            throw error.message || error;
        });
};

/**
 * @description set "best" status to TRUE/FALSE
 * @param id
 * @param status TRUE/FALSE
 * @return updated model
 */
Photo.setBestStatus = function (id, status) {
    if (!status) return Promise.reject('>>> \'status\' <<< field in query not defined');
    return this.UPDATE(id, { best: JSON.parse(status) });
};

/**
 * @description erase images(src and thumbnails) from FS >> removes PHOTO model from DB >> remove and all related COMMENTS
 * @param photo_id
 * @return success status
 */
Photo.erasePhoto = function (photo_id) {
    return this.GETbyId(photo_id)
        .then(function (photo) {
            return Promise.all([
                fse.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/src/${photo.filename}`),
                fse.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/thumbnail-mid/${photo.filename}`),
                fse.remove(`${PHOTO_DIR}/uid-${photo.user_id}/${photo.album_id}/thumbnail-low/${photo.filename}`)
            ]);
        })
        .then(() => {
            return this.REMOVE(photo_id);
        })
        .then(() => {
            return Comment.query()
                .delete()
                .where({ entity_id: photo_id, type: 'photo' });
        })
        .catch(error => {
            throw error.message || error;
        });
};

module.exports = Photo;
