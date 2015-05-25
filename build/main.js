var App = React.createClass({displayName: "App",
  getInitialState: function() {
    return {articleID: undefined};
  },
  handleLinkClick: function(articleID) {
    this.setState({"articleID": articleID});
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(QuestionList, {
          url: "http://localhost:8000/questions/?format=json", 
          handleLinkClick: this.handleLinkClick}), 
        this.state.articleID && (
          React.createElement(Article, {articleID: this.state.articleID})
        )
      )
    );
  }
});

var Article = React.createClass({displayName: "Article",
  getInitialState: function() {
    return {
      article: {
        title: "Loading...",
        reference: []
      },
      nextArticleID: undefined
    };
  },
  handleLinkClick: function(articleID) {
    this.setState({"nextArticleID": articleID});
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

    this.setState({"nextArticleID": undefined});
  },
  componentDidMount: function() {
    this.componentWillReceiveProps(this.props);
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("article", null, 
          React.createElement("h1", null, this.state.article.title), 
          React.createElement("ul", {className: "reference-list"}, 
            this.state.article.reference.map(function(q) {
              return (
                React.createElement("li", {key: q}, 
                  React.createElement("a", {className: "reference", onClick: this.handleLinkClick.bind(null, q)}, "Reference: ", q), 
                  React.createElement("span", {className: "logic", title: "联系的逻辑属性"}, "TODO"), 
                  React.createElement("a", {className: "remove-reference"}, "删除")
                )
              );
            }, this)
          ), 
          React.createElement("div", {className: "add-reference"}, 
              React.createElement("select", {className: "add-reference-select"}, 
                  React.createElement("option", {value: "TODO"}, "TODO")
              ), 
              React.createElement("input", {className: "add-reference-logic", type: "text", placeholder: "逻辑属性"}), 
              React.createElement("input", {className: "current-id", type: "hidden", value: "TODO"}), 
              React.createElement("button", {className: "add-reference-button"}, "添加联系")
          ), 
          React.createElement("div", null, 
              React.createElement("a", {className: "edit", href: ""}, "编辑"), 
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
