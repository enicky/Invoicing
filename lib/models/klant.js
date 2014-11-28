/**
 * Created by NicholasE on 26/11/2014.
 */
var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, ObjectId = Schema.ObjectId;

var KlantSchema = new Schema({
	createdAt : {type : Date, default : Date.now},
	klantnummer : Number,
	naam : String,
	straat : String,
	nummer :   String,
	bus : String,
	gemeente : String,
	postcode : String,
	important : Boolean
});

KlantSchema.pre('save', true, function(next, done){
	var self = this;
	var Counters = mongoose.model('Counters');
	if (self.isNew){
		Counters.findOneAndUpdate({_id : 'klantid'},{$inc:{seq:1}}, {new : true}, function(err, counter){
			if (err) return done(err);
			self.klantnummer = counter.seq;
			done();
		})
	}else{
		// done should be called after next
		setTimeout(done,0);
	}
	next();
})

mongoose.model( 'Klant',KlantSchema);