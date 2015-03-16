var React = require('react');
var spotify = require('./spotifySearchModule');
var MasonryMixin = require('react-masonry-mixin');
 
var masonryOptions = {
    transitionDuration: 0,
    columnWidth: 350,
    gutter: 10
};


var Card = React.createClass({
    mixins: [MasonryMixin('masonryContainer', masonryOptions)],
    loadData: function(query){
        var self = this;
        if (!query) return false;
        spotify.relatedSearch(query, function(items){
                self.setState({data: items})
        });
    },
    getInitialState: function(){
        return {data: undefined, query: 'Devo'}
    },
    newArtistSearch: function(event){
        event.preventDefault();
        this.loadData(this.refs.artist.getDOMNode().value);
    },
    componentDidMount: function(){
        this.loadData()
    },
    render: function(){
        var files;
        if (this.state.data){
            files = this.state.data.map(
                function(data){
                    var bio = data.bio;
                    var item = data.tracks;
                    var name = item[0].artists[0].name;
                    var ids = [];
                    item.forEach(function(item){
                        ids.push(item.id)
                    });
                    var idString = ids.join(',');
                    var playerURL = 'https://embed.spotify.com/?uri=spotify:trackset:_top_tracks:' + idString;
                    return (<div className="card"><h4>{name}</h4><p>{bio}</p><div className="audio"><div></div><div className="bottom"><iframe src={playerURL} seamless width="350" height="425" frameborder="0" allowtransparency="true"></iframe></div></div></div>);
                });
            return (
                <div>
                <form className="search-form" onSubmit={this.newArtistSearch}>
                    <h3>Artist To Search</h3>
                    <input type="text" ref="artist" defaultValue={this.state.query}/>
                    <input type="submit" value="new search?"/>
                </form>
                <div ref="masonryContainer">{files}</div>
                </div>
                )
        }
        else {
            return (
                <div>
            <form className="search-form" onSubmit={this.newArtistSearch}>
                    <h3>Artist To Search</h3>
                    <input type="text" ref="artist" defaultValue={this.state.query}/>
                    <input type="submit" value="new search?"/>
            </form>
            <div ref="masonryContainer">Search for an artist above!</div>
            </div>
            )
        }
    }

});

module.exports = Card