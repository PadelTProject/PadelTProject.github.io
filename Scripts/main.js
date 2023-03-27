
var currentInfo = null;


$.getJSON('data.json', function (data) {
  // success callback
  // 'data' variable contains the parsed JSON data
  console.log(data);
}).fail(function (jqxhr, textStatus, error) {
  // error callback
  var err = textStatus + ", " + error;
  console.log("Request Failed: " + err);
});