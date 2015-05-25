var QuestionList = React.createClass({displayName: "QuestionList",
  render: function() {
    var items = this.props.data.map(function (q) {
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

var data = [
  {title: "Answer to The Ultimate Question of Life, the Universe, and Everything"},
  {title: "Open the pod bay doors"}
];

React.render(
  React.createElement(QuestionList, {data: data}),
  document.getElementById('content')
);
