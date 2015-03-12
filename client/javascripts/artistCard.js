var React = require('react');
var spotify = require('./spotifySearchModule');
var MasonryMixin = require('react-masonry-mixin');
 
var masonryOptions = {
    transitionDuration: 0,
    columnWidth: 300,
    gutter: 40
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
        return {data: undefined, query: 'U2'}
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
                function(item){
                    var name = item[0].artists[0].name;
                    var artist = item.map(function(track){
                        return (<div><div className="title">{track.name}<br></br></div>
                            <div className="audio"><audio src={track.preview_url} controls="controls" preload="none"></audio></div></div>)
                    })
                    return (<div className="card"><h4>{name}</h4>{artist}</div>);
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