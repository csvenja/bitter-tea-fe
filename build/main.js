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
    var items = this.state.data.map(function (q) {
      return (
        React.createElement(QuestionListItem, null, 
          q.title
        )
      );
    });
    return (
      React.createElement("ul", {className: "question-list"}, 
        items
      )
    );
  }
});

var QuestionListItem = React.createClass({displayName: "QuestionListItem",
  render: function() {
    return (
      React.createElement("li", null, 
        React.createElement("a", {className: "question", href: ""}, this.props.children)
      )
    );
  }
});

React.render(
  React.createElement(QuestionList, {url: "http://localhost:8000/questions/?format=json"}),
  document.getElementById('content')
);
