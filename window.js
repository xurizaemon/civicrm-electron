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

ipc.on('settings-load', function(settings) {
  console.log(settings.server, 'settings s');
  console.log(settings.path, 'settings p');
  console.log(settings.key, 'settings k');
  console.log(settings.apikey, 'settings a');
  $('#settings-server').val(settings.server);
  $('#settings-path').val(settings.path);
  $('#settings-key').val(settings.key);
  $('#settings-apikey').val(settings.apikey);
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

$('#settings-toggle').on('click', function() {
  $('#settings').toggle();
})

$('#settings-save').on('click', function() {
  var settings = {
    server: 'https://fuzion.fudev.co.nz',
    path: '/sites/all/modules/civicrm/extern/rest.php',
    key: 'JK54RTsg23hB2wdv',
    api_key: 'SECRETAPIKEYDONKEYFART'
  };
  ipc.send('settings-save', settings);
});
