var QuestionList = React.createClass({
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

React.render(
  <QuestionList url="http://localhost:8000/questions/?format=json" />,
  document.getElementById('content')
);
