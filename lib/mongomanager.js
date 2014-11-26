/**
 * Created by NicholasE on 23/10/2014.
 */
if (typeof define !== 'function') {
	var define = require('amdefine')(module);
}
var path = require("path");
var cfg = require(path.join(__dirname, '..' , 'configuration', "config"));


define(['fs', 'async', 'sugar', 'path',  'restler', 'mongoose'],
		function(fs, async, sugar, path, restler, mongoose) {
			MongoManager = function (options) {
				this.Logger = options && options.Logger ? options.Logger : null;

				mongoose.connection.on('error', console.log);

				var mongoServer = cfg.database.host;
				var mongoPort = cfg.database.port;
				var mongoDatabaseName = cfg.database.name;

				//mongoose.connect('mongodb://' + mongoServer + ':' + mongoPort + '/'+ mongoDatabaseName);
				console.log('connect to DB Done');
			}

			MongoManager.prototype.init = function(){
				var that = this;
				fs.readdirSync(__dirname + "/models").forEach(function (file) {
					if(that.Logger) that.Logger.log('debug','init model : ', file);
					if (~file.indexOf(".js")) {
						require (__dirname + "/models/" + file);
					}
				});
			}




			var exports = MongoManager;
			return exports;


		});