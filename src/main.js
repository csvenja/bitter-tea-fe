var kBaseURL = "http://localhost:8000"

var App = React.createClass({
  getInitialState: function() {
    return {articleID: null};
  },
  handleLinkClick: function(articleID) {
    this.setState({"articleID": articleID});
  },
  render: function() {
    return (
      <div className="fullheight">
        <article>
          <h1>Your cup, please.</h1>
          <QuestionList handleLinkClick={this.handleLinkClick} />
        </article>
        {this.state.articleID && (
          <Article articleID={this.state.articleID} />
        )}
      </div>
    );
  }
});

var Article = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
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
  handleAddLink: function(e) {
    e.preventDefault();

    if (this.state.newLinkID == null) {
      alert("请选择问题");
      return;
    }

    var url = kBaseURL + "/add_link/";
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        from_id: this.props.articleID,
        to_id: this.state.newLinkID,
        logic: this.state.newLinkLogic
      },
      success: function(data) {
        this.setState({newLinkLogic: ""});

        // reload links
        this.componentWillReceiveProps(this.props);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  componentWillReceiveProps: function(nextProps) {
    var url = kBaseURL + "/questions/" + nextProps.articleID + "/?format=json";
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
    this.fetchArticles();
  },
  fetchArticles: function() {
    var url = kBaseURL + "/questions/?format=json";
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({articles: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
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
      <div className="fullheight">
        <article>
          <h1>{this.state.article.title}</h1>
          <ul className="reference-list">
            {this.state.article.reference.map(function(q) {
              return (
                <li key={q.id}>
                  <a className="reference" onClick={this.handleLinkClick.bind(null, q.id)}>{q.title}</a>{' '}
                  <span className="logic" title="联系的逻辑属性">TODO</span>{' '}
                  {this.state.editing && (
                    <a className="remove-reference">删除</a>
                  )}
                </li>
              );
            }, this)}
          </ul>
          {this.state.editing && (
            <div className="add-reference">
              <form className="form-inline">
                <select className="form-control" valueLink={this.linkState('newLinkID')}>
                  <option value="-1" disabled="disabled" selected>Select question</option>
                  {this.state.articles.map(function(q) {
                    return (
                      <option value={q.id} key={q.id}>{q.title}</option>
                    );
                  }, this)}
                </select>{' '}
                <input className="form-control" type="text" placeholder="逻辑属性" valueLink={this.linkState('newLinkLogic')} />{' '}
                <button className="btn btn-default" onClick={this.handleAddLink}>添加联系</button>{' '}
                <button className="btn btn-default" data-toggle="modal" data-target="#compose">新建问题</button>
              </form>

              <div className="modal fade" id="compose" tabindex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                      <h4 className="modal-title">新建问题</h4>
                    </div>
                    <div className="modal-body">
                      <form className="form-horizontal">
                        <div className="form-group">
                          <div className="col-sm-12">
                            <input type="email" className="form-control" placeholder="标题" />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-sm-12">
                            <textarea className="form-control" rows="12" placeholder="内容"></textarea>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" data-dismiss="modal">取消</button>
                      <button type="button" className="btn btn-primary">提交</button>
                    </div>
                  </div>
                </div>
              </div>

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
      url: kBaseURL + "/questions/?format=json",
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
