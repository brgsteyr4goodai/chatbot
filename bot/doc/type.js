//jsdoc types

/**
 * @typedef {Object} queryObject
 * @property {String} session
 * @property {Object} queryInput
 * @property {Object} queryInput.text
 * @property {String} queryInput.text.text
 * @property {String} queryInput.text.languageCode
 */

/**
 * @typedef {Object} interIO
 * @property {google.cloud.dialogflow.v2.IQueryResult} response
 * @property {queryObject} query
 * @property {String} text
 */