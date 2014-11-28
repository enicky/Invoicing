/**
 * Created by NicholasE on 27/11/2014.
 */
var mongoose = require('mongoose')
		, Schema = mongoose.Schema
		, ObjectId = Schema.ObjectId;

var CountersSchema = new Schema({
	_id : String,
	seq : Number
});

mongoose.model( 'Counters',CountersSchema);