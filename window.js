var $ = require('jquery');
var ipc = require('ipc');

var qKeyupTimer = null;
var qKeyupDelay = 300;

ipc.on('contact-results', function(contacts) {
  for (var i in contacts) {
    var contact = contacts[i];
    $('#contacts').append('<li>' + contact.display_name + ' &lt;' + contact.email + '&gt; ' + contact.phone + '</li>');
  }
});

$('#q').on('keyup', function() {
  if (qKeyupTimer) {
    window.clearTimeout(qKeyupTimer);
  }
  qKeyupTimer = window.setTimeout( function() {
    qKeyupTimer = null;
    search = $('#q').val();
    ipc.send('contact-search', search);
  }, qKeyupDelay);
});
