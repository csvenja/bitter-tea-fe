var QuestionList = React.createClass({
  render: function() {
    var items = this.props.data.map(function (q) {
      return (
        <QuestionListItem>
          {q.title}
        </QuestionListItem>
      );
    });
    return (
      <ul className="question-list">
        {items}
      </ul>
    );
  }
});

var QuestionListItem = React.createClass({
  render: function() {
    return (
      <li>
        <a className="question" href="">{this.props.children}</a>
      </li>
    );
  }
});

var data = [
  {title: "Answer to The Ultimate Question of Life, the Universe, and Everything"},
  {title: "Open the pod bay doors"}
];

React.render(
  <QuestionList data={data} />,
  document.getElementById('content')
);
