var path = require('path');

var matchRequest = require('express-match-request'),
    cjson = require('cjson');

/**
 * "Hard-coded Response" module for Express JS.
 * @module express-hard-coded-response
 *
 * @function hardCodedResponse
 *
 * @description
 * This function is an Express JS middleware which would try to match the specified pattern (from an array of MatchCondition objects)
 * with req.originalUrl.
 * <br /> - If no match is found, then the request would just pass through.
 * <br /> - If a match is found, then serve the corresponding file (specified in the MatchCondition object) as its hard-coded response.
 * <br />
 * <br /> Note: res.locals['matchedCondition'] is set as per the first-matched-condition
 *
 * @param {Object}  options
 * @param {MatchCondition[]} [options.conditions]       - Array of conditions which would be used for matching with req.originalUrl
 *                                                        <br /> A <b>falsy-value</b> (or empty array) would make this function call effectively empty and the request would pass-through
 * @param {Boolean} [options.verbose=false]             - <b>truthy-value</b> to log each matched URL and corresponding pattern
 * @param {Object}  [options.baseDir="<empty-string>"]  - Base directory for the relative paths
 * @param {Object}  [options.debugNote="This is a hard-coded response intended for debugging purposes only"] - Debug note to be added as HTTP header (and JSON property if MatchCondition says .type is 'json')
 *                                                                                                             <br /> - If responseText & responseFile are not provided in MatchCondition, then debugNote is used as the response
 *                                                                                                             <br /> - Set it to <b>false</b> to disable it
 * @param {Object}  [options.console=console]           - A <b>logging/console object</b>, which supports .log() and .warn()
 *
 * @return {ExpressMiddleware} Express middleware
 */
var hardCodedResponse = function (options) {
    options = options || {};
    var conditions = options.conditions,
        verbose = options.verbose || false,
        baseDir = options.baseDir || "",
        debugNote = options.debugNote === false ? false : 'This is a hard-coded response intended for debugging purposes only',
        logger = options.console || console;

    if (conditions && conditions.length) {
        return matchRequest(
            {
                conditions: conditions,
                verbose: verbose,
                console: logger,
                addMatchedConditionToResLocalsProperty: 'matchedCondition'
            },
            function (req, res, next) {    // eslint-disable-line no-unused-vars
                // No need to call next() inside this function, since we want to send the hard-coded response in this function (for debugging purposes only).
                var matchedCondition = res.locals['matchedCondition'];
                res.status(matchedCondition.status || 200);
                if (debugNote !== false) {
                    res.setHeader('debugNote', debugNote);
                }

                if (matchedCondition.contentType) {
                    res.setHeader('Content-Type', matchedCondition.contentType);
                } else if (matchedCondition.type && matchedCondition.type.toLowerCase() === 'json') {
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                }

                var response;
                if (matchedCondition.responseText === '') {
                    response = '';
                } else {
                    response = matchedCondition.responseText || (matchedCondition.responseFile && require('fs').readFileSync(path.join(baseDir, matchedCondition.responseFile), 'utf8'));

                    if (!response) {
                        if (matchedCondition.type && matchedCondition.type.toLowerCase() === 'json') {
                            response = '{}';
                        } else {
                            response = debugNote || '';
                        }
                    }
                }

                if (matchedCondition.type && matchedCondition.type.toLowerCase() === 'json') {
                    var jsonObject = cjson.parse(response);
                    if (debugNote !== false) {
                        jsonObject.debugNote = 'This is a hard-coded response intended for debugging purposes only';
                    }
                    response = JSON.stringify(jsonObject, null, 4);
                }

                res.send(response);
            }
        );
    } else {
        return function (req, res, next) {
            next();
        };
    }
};

/**
 * Express middleware
 * @name ExpressMiddleware
 * @typedef {Function} ExpressMiddleware
 * @param {Object}   req  - Request object
 * @param {Object}   res  - Response object
 * @param {Function} next - Next function
 */

/**
 * The condition to be matched (<b>.pattern</b> is used for match with request and other attributes are used for response)
 * @typedef {Object} MatchCondition
 * @property {String} pattern                  - <b>"none"</b> or <b>falsy-value</b> would match none
 *                                               <br /> <b>"*"</b> or <b>"all"</b> would match all
 *                                               <br /> <b>"&lt;any-other-pattern&gt;"</b> would be searched as plain string anywhere in the req.originalUrl
 * @property {String} [status=200]             - Response status
 * @property {String} [type]                   - Type of response (currently supporting 'json')
 *                                               <br />
 *                                               <br /> <b>If 'json' is used:</b>
 *                                               <br /> - <b>responseFile</b>'s contents would be read as commented-json (CJSON) and the commentes would be stripped-off.
 *                                               <br /> - 'Content-Type' header is set as 'application/json; charset=utf-8' by default, unless overridden using <b>contentType</b> option.
 *                                               <br /> - <b>debugNote</b> would be added as a property to the JSON response (this can be overwritten through the options when setting up the middleware).
 * @property {String} [contentType]            - 'Content-Type' header
 * @property {String} [responseText]           - The text to be used as the hard-coded response (responseText has more priority than responseFile)
 * @property {String} [responseFile]           - The file to be used as the hard-coded response (responseText has more priority than responseFile)
 * @property {*} [Any-other-object-properties] - Any other object properties (these might be accessed after match from res.locals['matchedCondition'])
 */

module.exports = hardCodedResponse;
