var App = React.createClass({
  getInitialState: function() {
    return {articleID: null};
  },
  handleLinkClick: function(articleID) {
    this.setState({"articleID": articleID});
  },
  render: function() {
    return (
      <div className="container">
        <article>
          <h1>Your cup, please.</h1>
          <QuestionList
            url="http://localhost:8000/questions/?format=json"
            handleLinkClick={this.handleLinkClick} />
        </article>
        {this.state.articleID && (
          <Article articleID={this.state.articleID} />
        )}
      </div>
    );
  }
});

var Article = React.createClass({
  getInitialState: function() {
    return {
      article: {
        title: "Loading...",
        reference: []
      },
      nextArticleID: null,
      editing: false
    };
  },
  handleLinkClick: function(articleID) {
    this.setState({"nextArticleID": articleID});
  },
  handleEditClick: function() {
    this.setState({"editing": !this.state.editing});
  },
  componentWillReceiveProps: function(nextProps) {
    var url = "http://localhost:8000/questions/" + nextProps.articleID + "/?format=json";
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({article: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(nextProps.url, status, err.toString());
      }.bind(this)
    });

    this.setState({"nextArticleID": null});
  },
  componentDidMount: function() {
    this.componentWillReceiveProps(this.props);
    this.updateContentWidth();
  },
  componentWillUnmount: function() {
    this.updateContentWidth();
  },
  updateContentWidth: function() {
    var n_articles = $("article").length;
    var width = 600;
    if (n_articles > 1) {
      width += 400 * (n_articles - 1);
    }
    $("#content").width(width);
  },
  render: function() {
    return (
      <div className="container">
        <article>
          <h1>{this.state.article.title}</h1>
          <ul className="reference-list">
            {this.state.article.reference.map(function(q) {
              return (
                <li key={q}>
                  <a className="reference" onClick={this.handleLinkClick.bind(null, q)}>Reference: {q}</a>
                  <span className="logic" title="联系的逻辑属性">TODO</span>
                  {this.state.editing && (
                    <a className="remove-reference">删除</a>
                  )}
                </li>
              );
            }, this)}
          </ul>
          {this.state.editing && (
            <div className="add-reference">
                <select className="add-reference-select">
                    <option value="TODO">TODO</option>
                </select>
                <input className="add-reference-logic" type="text" placeholder="逻辑属性" />
                <input className="current-id" type="hidden" value="TODO" />
                <button className="add-reference-button">添加联系</button>
            </div>
          )}
          <div>
              <a className="edit" onClick={this.handleEditClick}>{this.state.editing ? "取消" : "编辑"}</a>
              <p className="content">{this.state.article.content}</p>
              <div className="edit-content">
                  <textarea className="edit-pad" type="text" data-id="{{ question.pk }}">{this.state.article.content}</textarea>
                  <button className="edit-submit">提交</button>
              </div>
          </div>
        </article>
        {this.state.nextArticleID && (
          <Article articleID={this.state.nextArticleID} />
        )}
      </div>
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
