var spotify = require('./spotifySearchModule');
var React = require('react');
var ArtistCard = require('./artistCard')

var $ = require('jquery');


React.render(<ArtistCard />, document.getElementById('test'));