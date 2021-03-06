/*
 * debug.js
 *
 * This module provides some functions that are used when the engine is run in "debug" mode.
 * (Debug mode is enacted by passing the --debug switch to server.js)
 * 
 */
var dashboard = require('./dashboard');
var log = require('./log').logger('debug');
var config = require('./config');
var path = require('path');
var pathIsInside = require('path-is-inside');

var watch_semaphore = 0;
var NCP_TIMEOUT = 4000;

// App reloader
var appReloader = function(event, pth, details) {
  var pth = path.normalize(details.watchedPath || details.path);

  // Don't watch for changes if there is an update in progress
  if(watch_semaphore) { 
    log.warn("Not reloading " + pth + " because a reload is already in progress.");
    return; 
  }

  // Determine which app changed, and re-copy that app
  app_index = dashboard.getAppIndex();
  for(var app_id in app_index) {
    app_path = app_index[app_id].app_archive_path;
    app_path = path.normalize(app_path);
    // if(pathIsInside(app_path, pth) || pathIsInside(pth, app_path)) {
    //   log.info(app_id + ' was changed. Reloading...');
    //   watch_semaphore+=1;
    //   var timeout = setTimeout(function() {
    //     log.warn('Timeout waiting for reload of ' + app_id);
    //     watch_semaphore-=1;
    //     watch_semaphore = watch_semaphore < 0 ? 0 : watch_semaphore;
    //   }, NCP_TIMEOUT);
    //   return dashboard.reloadApp(app_id, function(err, result) {
    //     clearTimeout(timeout);
    //     log.info(app_id + ' updated.');
    //     watch_semaphore-=1;  
    //     watch_semaphore = watch_semaphore < 0 ? 0 : watch_semaphore;
    //   });        
    // }
  } 
}; 

// This function is called (if enabled) at application startup.
// Nominally, it sets up a "watcher" that live-reloads system apps if they are edited while the system is running.
// The code the actually performs the copy operation is commented out above, however, so it really does nothing.
//
// TODO : Figure out why the code above is commented out - do we still need this module?
function startDebug() {
  log.info("Starting debug watcher...");
  var chokidar = require('chokidar');
  var pth = path.resolve('./dashboard/apps');
  log.debug('Watching '+ pth + ' for changes...');
  var watcher = chokidar.watch(pth, {
    ignored: /[\/\\]\./,
    persistent: true
  });
  watcher.on('raw', appReloader);
  var watcher = chokidar.watch(config.getDataDir('apps'), {
    ignored: /[\/\\]\./,
    persistent: true
  });
  watcher.on('raw', appReloader);
}

exports.start = startDebug;