const mongoose = require("mongoose");
// Middleware
const db = 'mongodb+srv://document-tracking-system:document-tracking-system@cluster0.perlp5x.mongodb.net/document-tracking-system?retryWrites=true&w=majority'
// Connect to MongoDB using the connection string
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
}).then(() => {
  console.log(`Connection successful`);
}).catch((e) => {
  console.log(`No connection: ${e}`);
});

// mongodb://localhost:27017