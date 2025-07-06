const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Upload folder
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// Static files
app.use('/uploads', express.static(uploadDir));
app.use(express.static('public'));

// Upload handler
app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/');
});

// Homepage handler
app.get('/', (req, res) => {
  const files = fs.readdirSync(uploadDir);
  const fileLinks = files.map(file => `<li><a href="/uploads/${file}" download>${file}</a></li>`).join('');
  res.send(`
    <h1>Upload a file</h1>
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
    </form>
    <h2>Uploaded Files</h2>
    <ul>${fileLinks || '<li>No files yet</li>'}</ul>
  `);
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
