/**
 * Created by NicholasE on 28/11/2014.
 */
var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, ObjectId = Schema.ObjectId;

var ArticleSchema = new Schema({
	createdAt : {type : Date, default : Date.now},
	artikelnummer : Number,
	naam : String,
	stock : {type : Number, default : 0}
});

ArticleSchema.pre('save', true, function(next, done){
	var self = this;
	var Counters = mongoose.model('Counters');
	if (self.isNew){
		Counters.findOneAndUpdate({_id : 'artikelid'},{$inc:{seq:1}}, {new : true}, function(err, counter){
			if (err) return done(err);
			self.artikelnummer = counter.seq;
			done();
		})
	}else{
		// done should be called after next
		setTimeout(done,0);
	}
	next();
})

mongoose.model( 'article',ArticleSchema);