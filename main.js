var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.
var ipc = require('ipc');
var civicrmApi = require('civicrm');
var fs = require('fs');

var settings = {};
var crm = null;

var civicrmApp = {
  loadSettings: function() {
    var settingsPath = app.getPath('userData') + '/settings.json';
    try {
      // Throws error if file doesn't exist.
      fs.openSync(settingsPath, 'r+');
      var settings = JSON.parse(fs.readFileSync(settingsPath));
      mainWindow.webContents.send('settings-load', settings);
    } catch (err) {
      // If error, then there was no settings file (first run).
      try {
        var settings = {
          server: 'https://civicrm.example.org',
          path: '/sites/all/modules/civicrm/extern/rest.php',
          key: '',
          api_key: ''
        };
        fs.writeFileSync(settingsPath, JSON.stringify(settings), 'utf-8');
        console.log("Created default settings file " + settingsPath);
      } catch (err) {
        console.log("Error creating settings file: " + JSON.stringify(err));
        throw err;
      }
    }
  },

  settingsSave: function(event, arg) {
    console.log(arg, 'arg');
    fs.writeFileSync(app.getPath('userData') + '/settings.json', JSON.stringify(arg), 'utf-8');
    console.log('Saved settings to ' + app.getPath('userData') + '/settings.json');
    civicrmApp.loadSettings();
  },

  contactSearch: function(event, arg) {
    var params = {
      contact_type: 'Individual',
      return: 'display_name,email,phone',
      first_name: arg
    };
    crm.get('contact', params, function (result) {
      console.log(result, 'CRM result');
      vals = [];
      for (var i in result.values) {
        vals.push(result.values[i]);
      }
      if (vals.length) {
        mainWindow.webContents.send('contact-results', vals);
      }
    });
  }
};


// Report crashes to our server.
require('crash-reporter').start();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  // Open the devtools.
  // mainWindow.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // Initialise CiviCRM API.
  civicrmApp.loadSettings();
  crm = civicrmApi(settings);
});

// On contact search, retrieve and send back results.
ipc.on('contact-search', civicrmApp.contactSearch);

// On settings save, use and store the settings.
// We could validate here too.
ipc.on('settings-save', civicrmApp.settingsSave);
