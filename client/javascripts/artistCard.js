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
    loadData: function(){
        var self = this;
        spotify.relatedSearch('u2', function(items){
                self.setState({data: items})
        });
    },
    getInitialState: function(){
        return {data: undefined}
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
                            <div className="audio"><audio src={track.preview_url} controls="controls"></audio></div></div>)
                    })
                    return (<div className="card">{name}<br>{artist}</br></div>);
                });
            return (
                <div>
                <div ref="masonryContainer">{files}</div>
                </div>
                )
        }
        else {
            return (
            <div ref="masonryContainer">Loading</div>
            )
        }
    }

});

module.exports = Card