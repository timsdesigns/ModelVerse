const mongoose = require("mongoose"); // import mongoose from "mongoose";
// Define Schemas:
let modelSchema = mongoose.Schema({
  Title: {type: String, required: true},
  Description: {type: String, required: true},
  Category: {
    Name: String,
    Description: String
  },
  Properties: {
    VertexCount: Number,
    Materials: [String],
    FileSizeKB: Number
  },
  Tags: [String],
  ModelURL: String
});
let userSchema = mongoose.Schema({
  Username: {type: String, required: true},
  Password: {type: String, required: true},
  Email: {type: String, required: true},
  Birthday: Date,
  FavModels: [{type: mongoose.Schema.Types.ObjectId, ref: "Model"}]  
});
// Create Models:
let Model = mongoose.model("Model", modelSchema);
let User = mongoose.model("User", userSchema);
// Export Models:
module.exports.Model = Model;
module.exports.User = User;