var kQuestionListURL = "http://bitter-tea.svenja.im/questions/?format=json";

var questionMatcher = function(questions) {
  return function findMatches(q, callback) {
    var matches = [],
        substrRegex = new RegExp(q, 'i');

    $.each(questions, function(i, q) {
      if (substrRegex.test(q.title)) {
        matches.push(q.title);
      }
    });

    callback(matches);
  };
};

$.ajax({
  url: kQuestionListURL,
  dataType: 'json',
  success: function(data) {
    $('#search .typeahead').typeahead({
      hint: true,
      highlight: true,
      minLength: 1
    },
    {
      name: 'questions',
      source: questionMatcher(data)
    });
  },
  error: function(xhr, status, err) {
    console.error(status, err.toString());
  }
});

$('#search .typeahead').bind('typeahead:selected', function(obj, datum, name) {      
  alert(JSON.stringify(obj));
  alert(JSON.stringify(datum));
  alert(JSON.stringify(name));
});
