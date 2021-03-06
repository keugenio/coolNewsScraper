var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;


// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var CoolNewsFeedSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique: true
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `img` is required and of type String
  img: {
    type: String,
    required: true
  },  
  // `description` is required and of type String
  description: {
    type: String,
    required: true
  },
  // `content` is required and of type String
  content: {
    type: String,
    required: true
  },
  pubDate: { 
    type: Date, 
    default: Date.now 
  },   
  // `comment` is an object that stores a Comment id
  // The ref property links the ObjectId to the Comment model
  // This allows us to populate the Article with an associated Comment
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

CoolNewsFeedSchema.plugin(uniqueValidator, { type: 'mongoose-unique-validator' });

// This creates our model from the above schema, using mongoose's model method
var CoolNewsFeed = mongoose.model("CoolNewsFeed", CoolNewsFeedSchema);

// Export the Article model
module.exports = CoolNewsFeed;
