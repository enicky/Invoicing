/**
 * Created by NicholasE on 5/02/2015.
 */
var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, ObjectId = Schema.ObjectId;

var InvoiceSchema = new Schema({
	createdAt : {type : Date, default : Date.now},
	invoiceId : Number,
	title : String,
	customerId : {type: mongoose.Schema.Types.ObjectId, ref: 'Klant'},
	invoiceDate : {type : Date, default : Date.now},
	dueDate : {type : Date, default : Date.now},
	memo : String,
	status : Number
});

InvoiceSchema.pre('save', true, function(next, done){
	var self = this;
	var Counters = mongoose.model('Counters');
	if (self.isNew){
		Counters.findOneAndUpdate({_id : 'invoiceid'},{$inc:{seq:1}}, {new : true}, function(err, counter){
			if (err) return done(err);
			self.invoiceId = counter.seq;
			done();
		})
	}else{
		// done should be called after next
		setTimeout(done,0);
	}
	next();
})

mongoose.model( 'invoice',InvoiceSchema);