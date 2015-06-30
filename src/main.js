var React = require('react/addons');
var Rlite = require('rlite-router');
var Select = require('react-select');

var kBaseURL = "http://bitter-tea.svenja.im"
// var kBaseURL = "http://localhost:8000"

var App = React.createClass({
  componentDidMount: function () {
    console.log(this.props);
  },
  getInitialState: function() {
    return {nextArticleID: this.props.nextArticleID};
  },
  handleLinkClick: function(articleID) {
    this.setState({"nextArticleID": articleID});
  },
  render: function() {
    return (
      <div className="fullheight">
        <article>
          <h1>Your cup, please.</h1>
          <QuestionList handleLinkClick={this.handleLinkClick} />
        </article>
        {this.state.nextArticleID && (
          <Article articleID={this.state.nextArticleID} parent={this} />
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
  handleCloseClick: function() {
    this.props.parent.setState({nextArticleID: null});
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
  handleRemoveLink: function(articleID) {
    var url = kBaseURL + "/remove_link/";
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        from_id: this.props.articleID,
        to_id: articleID
      },
      success: function(data) {
        // reload links
        this.componentWillReceiveProps(this.props);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(url, status, err.toString());
      }.bind(this)
    });
  },
  handleAddArticle: function(e) {
    if (this.state.newArticleTitle == null || this.state.newArticleTitle == "") {
      alert("请填写标题");
      return;
    }

    var url = kBaseURL + "/questions/";
    $.ajax({
      url: url,
      method: 'POST',
      data: {
        title: this.state.newArticleTitle,
        content: this.state.newArticleContent
      },
      success: function(data) {
        this.setState({
          newArticleTitle: "",
          newArticleContent: ""
        });

        $("#compose").modal("hide");

        // reload articles
        this.fetchArticles();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, url, status, err.toString());
      }.bind(this)
    });
  },
  handleEditArticle: function() {
    var url = kBaseURL + "/questions/" + this.state.article.id + "/";
    $.ajax({
      url: url,
      method: 'PUT',
      data: {
        title: this.state.article.title,
        content: this.state.editedArticleContent
      },
      success: function(data) {
        // reload article
        this.componentWillReceiveProps(this.props);

        this.setState({editing: false});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(xhr, url, status, err.toString());
      }.bind(this)
    });
  },
  onNewLinkChange: function(value) {
    console.log("Selected " + value);
    this.setState({newLinkID: value});
  },
  componentWillReceiveProps: function(nextProps) {
    var url = kBaseURL + "/questions/" + nextProps.articleID + "/?format=json";
    $.ajax({
      url: url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({article: data});
        this.setState({editedArticleContent: data.content})
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
          <a className="close" onClick={this.handleCloseClick}>X</a>
          <ul className="reference-list">
            {this.state.article.reference.map(function(q) {
              return (
                <li key={q.id}>
                  <a className="reference" onClick={this.handleLinkClick.bind(null, q.id)}>{q.title}</a>{' '}
                  <span className="logic" title="联系的逻辑属性">TODO</span>{' '}
                  {this.state.editing && (
                    <a className="remove-reference" onClick={this.handleRemoveLink.bind(null, q.id)}>删除</a>
                  )}
                </li>
              );
            }, this)}
          </ul>
          {this.state.editing && (
            <div className="add-reference">
              <div className="form-inline">
                <Select
                  value={this.state.newLinkID}
                  options={this.state.articles.map(function(q) {
                    return { value: q.id, label: q.title };
                  }, this)}
                  onChange={this.onNewLinkChange}
                  placeholder="输入问题…" />{' '}
                <input className="form-control" type="text" placeholder="逻辑属性" valueLink={this.linkState('newLinkLogic')} />{' '}
                <button className="btn btn-default" onClick={this.handleAddLink}>添加联系</button>{' '}
                <button className="btn btn-default" data-toggle="modal" data-target="#compose">新建问题</button>
              </div>

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
                            <input type="email" className="form-control" placeholder="标题" valueLink={this.linkState('newArticleTitle')} />
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-sm-12">
                            <textarea className="form-control" rows="12" placeholder="内容" valueLink={this.linkState('newArticleContent')} />
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-default" data-dismiss="modal">取消</button>
                      <button className="btn btn-primary" onClick={this.handleAddArticle}>提交</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
          <div>
              <a className="edit" onClick={this.handleEditClick}>{this.state.editing ? "取消" : "编辑"}</a>
              {this.state.editing ? (
                <div>
                    <textarea className="form-control" rows="12" data-id="{{ question.pk }}" valueLink={this.linkState('editedArticleContent')} />
                    <button className="btn btn-default" onClick={this.handleEditArticle}>提交</button>
                </div>
              ) : (
                <p className="content">{this.state.article.content}</p>
              )}
          </div>
        </article>
        {this.state.nextArticleID && (
          <Article articleID={this.state.nextArticleID} parent={this} />
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


routes = new Rlite();
routes.add('', function () {
  React.render(
    <App />,
    document.getElementById('content')
  );
});
routes.add(':id', function(r) {
  React.render(
    <App nextArticleID={r.params.id} />,
    document.getElementById('content')
  );
});

// Hash-based routing
function processHash() {
  var hash = location.hash || '#';
  routes.run(hash.slice(1));
}
window.addEventListener('hashchange', processHash);
processHash();
