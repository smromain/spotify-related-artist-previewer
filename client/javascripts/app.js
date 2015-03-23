var React = require('react');
var spotify = require('./spotifySearchModule');

var SearchForm = React.createClass({

    getInitialState: function () {
        return {
            query: 'Devo'
        };
    },

    submitSearch: function (event) {
        event.preventDefault();
        var searchText = this.refs.artist.getDOMNode().value;
        if (!searchText) return;
        this.props.search(searchText);
    },

    render: function () {

        return (
            <form className="search-form" onSubmit={this.submitSearch}>
                <h3>Artist To Search</h3>
                <input type="text" ref="artist" defaultValue={this.state.query} />
                <input type="submit" value="Search" />
            </form>
        );

    }

});

var ArtistCard = React.createClass({

    render: function () {

        var tracks = this.props.artist.tracks;
        var name = tracks[0].artists[0].name;
        var bio = this.props.artist.bio;

        var idString = tracks.map(function (track) {
            return track.id;
        }).join(',');

        var playerURL = 'https://embed.spotify.com/?uri=spotify:trackset:_top_tracks:' + idString;

        return (
            <div className="card">
                <h2>{name}</h2>
                <p>{bio}</p>
                <div className="audio">
                    <div className="bottom">
                        <iframe src={playerURL} seamless width="350" height="425" frameBorder="0" allowTransparency="true"></iframe>
                    </div>
                </div>
            </div>
        );
    }

});

var App = React.createClass({

    loadData: function (query) {

        this.setState({
            loading: true,
            data: null
        });

        spotify.relatedSearch(query).then(function (artists) {

            artists = artists.filter(function (artist) {
                return artist.tracks.length > 0;
            });

            this.setState({
                data: artists,
                loading: false
            });

        }.bind(this));
    },

    getInitialState: function () {
        return {
            data: null,
            loading: false,
            query: 'Devo'
        };
    },

    createArtistCard: function (artist) {
        return <ArtistCard artist={artist} />;
    },

    render: function () {

        var displayComponent;

        if (this.state.loading) {
            displayComponent = <h3 className="loading">Loading related artists!</h3>;
        } else if (this.state.data) {
            displayComponent = this.state.data.map(this.createArtistCard);
        }

        return (
            <div>
                <SearchForm search={this.loadData} />
                <div className="card-container">
                    {displayComponent || 'Search above!'}
                </div>
            </div>
        );

    }

});

module.exports = App;