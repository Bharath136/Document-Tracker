const express = require("express");
const bcrypt = require('bcrypt')
const path = require('path');
const app = express();
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5100;
const mongoose = require('mongoose');
const { MONGO_URI } = require('./db/connect');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const multer = require('multer');
const models = require("./models/schema");
const http = require('http');
const socketIO = require('socket.io');

app.use(cors());

// user schema
app.post('/register', async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;
        const user = await models.User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new models.User({
            firstname,
            lastname,
            email,
            password: hashedPassword
        });
        const userCreated = await newUser.save();
        console.log(userCreated, 'user created');
        return res.status(201).send('Successfully Registered');
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await models.User.findOne({ email });
    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const jwtToken = jwt.sign({ userId: user._id }, 'mysecretkey2');
    res.json({ user, jwtToken });
});

app.get('/users', async (req, res) => {
    try {
        const users = await models.Customer.find();
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server Error');
    }
});


// Get all documents
app.get('/documents', async (req, res) => {
    try {
        const documents = await models.Document.find({});

        if (documents.length === 0) {
            return res.status(404).json({ message: 'No documents found.' });
        }

        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/document', (req, res) => {
    // Extract data from the request body
    const { userId, title, content, docId, createdBy, editedBy } = req.body;

    const page = new models.Document({
        userId,
        docId,
        title,
        content,
        editedBy,
        createdBy,
        date: new Date()
    });

    page.save()
        .then(() => {
            res.sendStatus(200); // Send a success response
        })
        .catch(error => {
            res.status(500).json({ error: 'Error saving content' }); // Send an error response
        });
});


app.get('/document/:docId', (req, res) => {
    const { docId } = req.params;
  
    models.Document.findOne({ docId })
      .then((document) => {
        if (!document) {
          return res.status(404).json({ error: 'Document not found' });
        }
        res.status(200).json(document);
      })
      .catch(error => {
        res.status(500).json({ error: 'Error retrieving the document' });
      });
  });


  
  app.put('/document/:docId', async (req, res) => {
    try {
      const { docId } = req.params;
      const { editorName, title, content } = req.body;
  
      // Check if the editorName exists in the editedBy array
      const document = await models.Document.findOne({ docId });
      if (!document) {
        return res.status(404).json({ error: 'Document not found' });
      }
  
      const existingEditor = document.editedBy.find((editor) => editor.editorName === editorName);
      if (existingEditor) {
        // If editorName exists, update the timestamp
        existingEditor.timestamp = new Date();
      } else {
        // If editorName doesn't exist, add a new entry to the editedBy array
        document.editedBy.push({ editorName, timestamp: new Date() });
        console.log('New editor added:', editorName);
      }
  
      // Update the content and title fields
      document.content = content;
      document.title = title;
  
      // Save the updated document
      await document.save();
  
      res.sendStatus(200); // Send a success response
    } catch (error) {
      // Handle validation errors if any
      const errorMessage = error.message || 'Error updating content';
      res.status(500).json({ error: errorMessage });
    }
  });
  
  

  app.delete('/document/:docId', (req, res) => {
    const { docId } = req.params;
  
    models.Document.findOneAndDelete({ docId })
      .then((deletedDocument) => {
        if (!deletedDocument) {
          return res.status(404).json({ error: 'Document not found' });
        }
        res.sendStatus(200); // Send a success response
      })
      .catch(error => {
        res.status(500).json({ error: 'Error deleting document' }); // Send an error response
      });
  });
  
  
  




// Serve static files from the 'uploads' directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // API endpoint to serve a single document based on filename
// app.get('/documents/:filename', (req, res) => {
//     const filename = req.params.filename;
//     const filePath = path.join(__dirname, 'uploads', filename);

//     // Send the file as a response
//     res.sendFile(filePath);
// });



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;
