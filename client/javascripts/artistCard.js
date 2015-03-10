var React = require('react');
var spotify = require('./spotifySearchModule');


var Card = React.createClass({
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
        var artistName;
        if (this.state.data){
            files = this.state.data.map(
                function(item){
                    var name = item[0].artists[0].name;
                    var artist = item.map(function(track){
                        return (<div>{track.name} <br></br>
                            <audio src={track.preview_url} controls="controls"></audio></div>)
                    })
                    return (<div><br></br>{name}<br>{artist}</br></div>);
                });
            return (
                <div>
                <div>{files}</div>
                </div>
                )
        }
        else {
            return (
            <div>Loading</div>
            )
        }
    }

});

module.exports = Card