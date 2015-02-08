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

				var mongoUrl = 'mongodb://' + mongoServer + ':' + mongoPort + '/' + mongoDatabaseName;
				this.Logger.log('info','CUSTOMCONNSTR_MONGOLAB_URI : ', process.env.CUSTOMCONNSTR_MONGOLAB_URI);//TEST
				mongoose.connect(process.env.CUSTOMCONNSTR_MONGOLAB_URI );
				this.Logger.log('connecting to DB Done');
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

			///LIB



			///KLANTEN
			/**
			 * Haal alle klanten op voor in grid te tonen
			 * @param cb
			 */
			MongoManager.prototype.getAllKlanten = function(cb) {
				var KlantenSchema = mongoose.model('Klant');
				KlantenSchema.find({}).exec(function (err, klanten) {
					return cb(err, klanten);
				});
			};

			MongoManager.prototype.getImportantKlanten = function(cb){
				var KlantenSchema = mongoose.model('Klant');
				KlantenSchema.find({important : true}).exec(function (err, klanten) {
					return cb(err, klanten);
				});
			}

			/**
			 * voeg nieuwe klant toe aan db
			 * @param klant
			 * @param cb
			 */
			MongoManager.prototype.addNewKlant = function(klant, cb){
				var KlantenSchema = mongoose.model('Klant');
				var newKlant = new KlantenSchema({
					naam : klant.naam,
					straat : klant.straat,
					nummer : klant.nummer,
					gemeente : klant.gemeente,
					postcode : klant.postcode,
					important : klant.important
				});
				newKlant.save(function(err){
					console.log('klantnummer : ', newKlant);
					return cb(err, newKlant);
				})
			};

			/**
			 * Update een klant
			 * @param klantid
			 * @param klant
			 * @param cb
			 */
			MongoManager.prototype.updateKlant = function(klantid, klant, cb){
				var KlantenSchema = mongoose.model('Klant');
				KlantenSchema.findOneAndUpdate({_id: klantid}, {$set : {
					naam : klant.naam,
					straat : klant.straat,
					nummer : klant.nummer,
					gemeente : klant.gemeente,
					postcode : klant.postcode,
					important : klant.important
				}}).exec(function(err, updatedKlant){
					return cb(err, updatedKlant);
				});
			};

			/**
			 * Zoek een klant door zijn _id ...
			 * @param klantid
			 * @param cb
			 */
			MongoManager.prototype.getKlantById = function(klantid, cb){
				var KlantenSchema = mongoose.model('Klant');
				KlantenSchema.findById(klantid, function(err, klant){
					return cb(err, klant);
				})
			};

			/**
			 * verwijder een klant door zijn id
			 * @param klantid
			 * @param cb
			 */
			MongoManager.prototype.removeKlantById = function(klantid, cb){
				var KlantenSchema = mongoose.model('Klant');
				KlantenSchema.findByIdAndRemove(klantid, function(err){
					return cb(err);
				})
			}


			///STOCK !!

			
			MongoManager.prototype.getAlmostEmptyStock = function(cb){
				var stock = mongoose.model('article');
				stock.where('stock').lte(10).exec(function(err, stock){
					return cb(err, stock);
				})
			};
			/**
			 * Haal de complete stock op
			 * @param cb
			 */
			MongoManager.prototype.getAllStock = function(cb){
				var stock = mongoose.model('article');
				stock.find({}).exec(function(err, stock){
					return cb(err, stock);
				})
			};

			/**
			 * Zoek 1 product op bij zijn artikelnummer!
			 * @param id
			 * @param cb
			 */
			MongoManager.prototype.getStockById = function(id, cb){
				var stock = mongoose.model('article');
				stock.findById(id).exec(function(err, item){
					//console.log('item : ', item);
					return cb(err, item);
				});
			};

			/**
			 * Voeg nieuw artikel toe
			 * @param newArticle
			 * @param cb
			 */
			MongoManager.prototype.addNewArticle = function(newArticle, cb){
				var stock = mongoose.model('article');
				var ns = new stock({
					naam : newArticle.naam,
					stock : newArticle.stock
				});
				ns.save(function(err){
					return cb(err);
				});
			}

			/**
			 * Update 1 artikel
			 * @param articleid
			 * @param newArticle
			 * @param cb
			 */
			MongoManager.prototype.updateStock = function(articleid, newArticle, cb){
				var stock = mongoose.model('article');
				stock.findOneAndUpdate({_id: articleid}, {$set : {
					naam : newArticle.naam,
					prijs : newArticle.prijs,
					stock : newArticle.stock
				}}).exec(function(err, updatedArticle){
					console.log('res : ', err);
					return cb(err, updatedArticle);
				});
			}

			/**
			 * zoek en verwijder een stock article
			 * @param articleId
			 * @param cb
			 */
			MongoManager.prototype.deleteStock = function(articleId, cb){
				var stock = mongoose.model('article');
				stock.findOneAndRemove({_id : articleId}, function(err, deletedArticle){
					return cb(err, deletedArticle);
				})
			}
			//INVOICES

			MongoManager.prototype.getAllInvoices = function(cb){
				var invoices = mongoose.model('invoice');
				invoices.find({}).exec(function(err, invoices){
					return cb(err, invoices);
				})
			}



			var exports = MongoManager;
			return exports;


		});