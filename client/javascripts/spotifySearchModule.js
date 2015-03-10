var $ = require('jQuery');
var Promise = require("bluebird");

function artistSearch(query, cb){
	$.ajax({
	    url: 'https://api.spotify.com/v1/search',
	    data: {
	        q: query,
	        type: 'artist'
	    },
	    success: function (origResp) {
        	$.ajax({
				url: 'https://api.spotify.com/v1/artists/' + origResp.artists.items[0].id + '/related-artists',
				success: function(data){
					return data.artists;
				}
			})
			.done(
				function(data){

					var finalDataPromises = [];

					data.artists.forEach(function(item){
						finalDataPromises.push(new Promise(function(resolve,reject){
							$.ajax({
								url: 'https://api.spotify.com/v1/artists/' + item.id + '/top-tracks?country=us',
								success: function(data){
									return resolve(data);
								}
							})
						}))

					})

					Promise.settle(finalDataPromises).then(function(results){
						var resultingData = [];
						results.forEach(function(item){
							resultingData.push(item.value().tracks);
						})
						return cb(resultingData);
					})

				}

			)
	    }
	})
};

module.exports = {relatedSearch: artistSearch};