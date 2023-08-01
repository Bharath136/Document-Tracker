// Import required modules
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const documentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdBy: { type: String, required: true },
  editedBy: [
    {
      editorName: { type: String, required: true },
      timestamp: { type: Date, default: new Date() }
    }
  ],
  date: { type: Date, default: new Date() }
});




// Define models using the schemas
const User = mongoose.model('User', userSchema);
const Document = mongoose.model('Document', documentSchema);

// Export the models
module.exports = {
    User,
    Document
};
