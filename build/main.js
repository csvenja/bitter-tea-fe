var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {articleID: undefined};
  },
  handleLinkClick: function(articleID) {
    this.setState({"articleID": articleID});
  },
  render: function() {
    var article = undefined;
    if (this.state.articleID) {
      article = (
        React.createElement(Article, {articleID: this.state.articleID})
      );
    }
    return (
      React.createElement("div", null, 
        React.createElement(QuestionList, {
          url: "http://localhost:8000/questions/?format=json", 
          handleLinkClick: this.handleLinkClick}), 
        article
      )
    );
  }
});

var Article = React.createClass({displayName: "Article",
  render: function() {
    return (
      React.createElement("p", null,  this.props.articleID)
    )
  }
});

var QuestionList = React.createClass({displayName: "QuestionList",
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      React.createElement("ul", {className: "question-list"}, 
        this.state.data.map(function(q) {
          return (
            React.createElement("li", {key: q.id}, 
              React.createElement("a", {className: "question", onClick: this.props.handleLinkClick.bind(null, q.id)}, q.title)
            )
          );
        }, this)
      )
    );
  }
});

React.render(
  React.createElement(App, null),
  document.getElementById('content')
);
