var dbus = require('dbus').getBus('session');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;

function ExtApp(appId, dbusConn, runtime) {
    this.appId = appId;
    this.dbusConn = dbusConn;
    this.runtime = runtime;

    this.on('create', this._onEvent.bind(this, 'create'));
    this.on('restart', this._onEvent.bind(this, 'restart'));
    this.on('pause', this._onEvent.bind(this, 'pause'));
    this.on('resume', this._onEvent.bind(this, 'resume'));
    this.on('stop', this._onEvent.bind(this, 'stop'));
    this.on('destroy', this._onEvent.bind(this, 'destroy'));
    this.on('voice_command', this._onEvent.bind(this, 'voiceCommand'));
    this.on('key_event', this._onEvent.bind(this, 'keyEvent'));
}
ExtApp.prototype._onEvent = function (name) {
    var eventName = null;
    var params = arguments.slice(1);
    switch (name) {
        case 'create':
            eventName = 'onCreate';
            break;
        case 'restart':
            eventName = 'onRestart';
            break;
        case 'pause':
            eventName = 'onPause';
            break;
        case 'resume':
            eventName = 'onResume';
            break;
        case 'stop':
            eventName = 'onStop';
            break;
        case 'destroy':
            eventName = 'onDestroy';
            break;
        case 'voiceCommand':
            eventName = 'nlp';
            params = [
                params[0].asr,
                JSON.stringify(params[0]),
            ];
            break;
        default:
            eventName = null;
            break;
    }

    if (!eventName) {
        return;
    }
    dbus._dbus.emitSignal(
        dbus.connection,
        this.dbusConn.objectPath,
        this.dbusConn.ifaceName,
        eventName,
        params,
        params.map(function() {
            return 's'
        })
    );
}

module.exports = ExtApp;