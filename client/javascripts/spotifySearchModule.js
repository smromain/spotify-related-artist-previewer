var $ = require('jQuery');
var Promise = require("bluebird");

/**
 * jQuery trick for sanitizing string.
 * @param html
 * @returns New string after sanitization.
 */
var sanitizeHTML = function (html) {
    return $('<div>' + html + '</div>').text();
};

/**
 * Make AJAX request to Spotify for artist information.
 * @param artist
 * @returns {bluebird}
 * @resolves artist object.
 */
var searchForArtist = function (artist) {

    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: artist,
                type: 'artist'
            },
            success: function (response) {
                resolve(response.artists.items[0]);
            },
            error: function (err) {
                reject(err);
            }
        });

    });

};

/**
 * Finds the artists related to base artist.
 * @param baseArtist
 * @returns {bluebird}
 * @resolves Array of artist objects.
 */
var getRelatedArtists = function (baseArtist) {

    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + baseArtist.id + '/related-artists',
            success: function (response) {
                resolve(response.artists);
            },
            error: function (err) {
                reject(err);
            }
        });

    });

};

/**
 * Retrieves the tracks for a given artist.
 * @param artist
 * @returns {bluebird}
 * @resolves Object with an array on key `tracks`.
 */
var getArtistTracks = function (artist) {

    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + artist.id + '/top-tracks?country=us',
            success: function (response) {
                resolve(response);
            },
            error: function (err) {
                reject(err);
            }
        });

    });

};

/**
 * Retrieves summary of artist.
 * @param artist
 * @returns {bluebird}
 * @resolves Sanitized string.
 */
var getArtistBioFromLastFM = function (artist) {

    return new Promise(function (resolve, reject) {

        $.ajax({
            url: 'https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=' + artist.name + '&api_key=4ab8061faad02381db25568da3d061ff&format=json',
            success: function (response) {
                var summary = response.artist.bio.summary;
                summary = sanitizeHTML(summary).split('Read more about')[0];
                resolve(summary);
            },
            error: function (err) {
                reject(err);
            }
        });

    });

};

/**
 * Gets related artist information by composing tracks and bio retrievals.
 * @param artist
 * @returns {*}
 */
var getRelatedArtistInfo = function (artist) {

    var promises = [getArtistTracks(artist), getArtistBioFromLastFM(artist)];

    return Promise.all(promises).spread(function (artistWithTracks, bio) {
        artistWithTracks.bio = bio;
        return artistWithTracks;
    });

};

module.exports = {
    relatedSearch: function (query) {
        return searchForArtist(query).then(getRelatedArtists).map(getRelatedArtistInfo);
    }
};
