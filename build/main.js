var kBaseURL = "http://localhost:8000"

var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {articleID: null};
  },
  handleLinkClick: function(articleID) {
    this.setState({"articleID": articleID});
  },
  render: function() {
    return (
      React.createElement("div", {className: "fullheight"}, 
        React.createElement("article", null, 
          React.createElement("h1", null, "Your cup, please."), 
          React.createElement(QuestionList, {handleLinkClick: this.handleLinkClick})
        ), 
        this.state.articleID && (
          React.createElement(Article, {articleID: this.state.articleID})
        )
      )
    );
  }
});

var Article = React.createClass({displayName: "Article",
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
      React.createElement("div", {className: "fullheight"}, 
        React.createElement("article", null, 
          React.createElement("h1", null, this.state.article.title), 
          React.createElement("ul", {className: "reference-list"}, 
            this.state.article.reference.map(function(q) {
              return (
                React.createElement("li", {key: q.id}, 
                  React.createElement("a", {className: "reference", onClick: this.handleLinkClick.bind(null, q.id)}, q.title), ' ', 
                  React.createElement("span", {className: "logic", title: "联系的逻辑属性"}, "TODO"), ' ', 
                  this.state.editing && (
                    React.createElement("a", {className: "remove-reference"}, "删除")
                  )
                )
              );
            }, this)
          ), 
          this.state.editing && (
            React.createElement("div", {className: "add-reference"}, 
              React.createElement("form", {className: "form-inline"}, 
                React.createElement("select", {className: "form-control", valueLink: this.linkState('newLinkID')}, 
                  React.createElement("option", {value: "-1", disabled: "disabled", selected: true}, "Select question"), 
                  this.state.articles.map(function(q) {
                    return (
                      React.createElement("option", {value: q.id, key: q.id}, q.title)
                    );
                  }, this)
                ), ' ', 
                React.createElement("input", {className: "form-control", type: "text", placeholder: "逻辑属性", valueLink: this.linkState('newLinkLogic')}), ' ', 
                React.createElement("button", {className: "btn btn-default", onClick: this.handleAddLink}, "添加联系"), ' ', 
                React.createElement("button", {className: "btn btn-default", "data-toggle": "modal", "data-target": "#compose"}, "新建问题")
              ), 

              React.createElement("div", {className: "modal fade", id: "compose", tabindex: "-1", role: "dialog", "aria-hidden": "true"}, 
                React.createElement("div", {className: "modal-dialog"}, 
                  React.createElement("div", {className: "modal-content"}, 
                    React.createElement("div", {className: "modal-header"}, 
                      React.createElement("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-label": "Close"}, React.createElement("span", {"aria-hidden": "true"}, "×")), 
                      React.createElement("h4", {className: "modal-title"}, "新建问题")
                    ), 
                    React.createElement("div", {className: "modal-body"}, 
                      React.createElement("form", {className: "form-horizontal"}, 
                        React.createElement("div", {className: "form-group"}, 
                          React.createElement("div", {className: "col-sm-12"}, 
                            React.createElement("input", {type: "email", className: "form-control", placeholder: "标题"})
                          )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                          React.createElement("div", {className: "col-sm-12"}, 
                            React.createElement("textarea", {className: "form-control", rows: "12", placeholder: "内容"})
                          )
                        )
                      )
                    ), 
                    React.createElement("div", {className: "modal-footer"}, 
                      React.createElement("button", {type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "取消"), 
                      React.createElement("button", {type: "button", className: "btn btn-primary"}, "提交")
                    )
                  )
                )
              )

            )
          ), 
          React.createElement("div", null, 
              React.createElement("a", {className: "edit", onClick: this.handleEditClick}, this.state.editing ? "取消" : "编辑"), 
              React.createElement("p", {className: "content"}, this.state.article.content), 
              React.createElement("div", {className: "edit-content"}, 
                  React.createElement("textarea", {className: "edit-pad", type: "text", "data-id": "{{ question.pk }}"}, this.state.article.content), 
                  React.createElement("button", {className: "edit-submit"}, "提交")
              )
          )
        ), 
        this.state.nextArticleID && (
          React.createElement(Article, {articleID: this.state.nextArticleID})
        )
      )
    )
  }
});

var QuestionList = React.createClass({displayName: "QuestionList",
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
