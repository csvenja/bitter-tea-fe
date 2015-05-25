var App = React.createClass({
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
        <Article articleID={this.state.articleID} />
      );
    }
    return (
      <div>
        <QuestionList
          url="http://localhost:8000/questions/?format=json"
          handleLinkClick={this.handleLinkClick} />
        {article}
      </div>
    );
  }
});

var Article = React.createClass({
  render: function() {
    return (
      <p>{ this.props.articleID }</p>
    )
  }
});

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
    return (
      <ul className="question-list">
        {this.state.data.map(function(q) {
          return (
            <li key={q.id}>
              <a className="question" onClick={this.props.handleLinkClick.bind(null, q.id)}>{q.title}</a>
            </li>
          );
        }, this)}
      </ul>
    );
  }
});

React.render(
  <App />,
  document.getElementById('content')
);
