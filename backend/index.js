// Required Dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// App Setup
const app = express();
const port = 5000;

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Enable CORS for Angular frontend
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());
app.use('/uploads', express.static(uploadDir));

// Database Connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) {
    console.error('❌ MySQL Connection Error:', err.stack);
    return;
  }
  console.log('✅ Connected to MySQL Database');
});

// JWT Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'Access denied: No token provided' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// User Role Enum
const UserRole = {
  Admin: 'admin',
  Landlord: 'landlord',
  PropertyManager: 'propertymanager',
  Tenant: 'tenant'
};

// Register
app.post('/api/register', (req, res) => {
  const { email, password, role } = req.body;
  const normalizedRole = role.toLowerCase();

  if (!Object.values(UserRole).includes(normalizedRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    db.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, password, normalizedRole], err => {
      if (err) return res.status(500).json({ message: 'Error creating user', error: err });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.json({ message: 'Login successful', token, role: user.role });
  });
});

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// POST: Maintenance Request
app.post('/maintenance-request', upload.array('media', 10), (req, res) => {
  const { issueDescription, urgency, status } = req.body;
  const files = req.files;

  if (!issueDescription || !urgency || !status || !files || files.length === 0) {
    return res.status(400).json({ message: 'Missing required fields or no media files uploaded.' });
  }

  const mediaFiles = files.map(file => ({
    file_path: `/uploads/${file.filename}`,
    file_type: file.mimetype.startsWith('video') ? 'video' : 'image'
  }));

  const query = 'INSERT INTO maintenance_requests (issue_description, urgency, status, media_json) VALUES (?, ?, ?, ?)';
  const values = [issueDescription, urgency, status, JSON.stringify(mediaFiles)];

  db.query(query, values, err => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    res.status(201).json({ message: '✅ Maintenance request submitted successfully', request: { issueDescription, urgency, status, media: mediaFiles } });
  });
});

// GET: All Maintenance Requests with Technician Names
app.get('/maintenance-requests', (req, res) => {
  const query = `
    SELECT mr.*, t.name AS technician_name
    FROM maintenance_requests mr
    LEFT JOIN technicians t ON mr.assigned_to = t.id
  `;
  
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    results.forEach(item => {
      try {
        const media = JSON.parse(item.media_json || '[]');
        item.media = media.map(m => ({
          file_path: m.file_path,
          file_type: m.file_type || (m.file_path?.endsWith('.mp4') ? 'video' : 'image')
        }));
      } catch {
        item.media = [];
      }

      item.assignedTo = item.technician_name || 'Not Assigned';
      item.propertyId = item.property_id;

      // ✅ Added for frontend compatibility
      item.completedAt = item.completed_at;
      item.requestedAt = item.created_at;
    });

    res.json(results);
  });
});



// GET: Single Maintenance Request
app.get('/maintenance-request/:id', (req, res) => {
  const id = req.params.id;

  db.query('SELECT * FROM maintenance_requests WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'Request not found' });

    const request = results[0];
    try {
      const media = JSON.parse(request.media_json || '[]');
      request.media = media.map(m => ({
        file_path: m.file_path,
        file_type: m.file_type || (m.file_path?.endsWith('.mp4') ? 'video' : 'image')
      }));
    } catch {
      request.media = [];
    }

    // ✅ Added for frontend compatibility
    request.completedAt = request.completed_at;
    request.requestedAt = request.created_at;

    res.json(request);
  });
});


// PUT: Update Maintenance Request
// PUT: Update Maintenance Request
app.put('/maintenance-requests/:id', authenticateJWT, (req, res) => {
  const requestId = req.params.id;
  const userRole = req.user.role;

  if (![UserRole.Admin, UserRole.PropertyManager, UserRole.Landlord].includes(userRole)) {
    return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
  }

  // Accept camelCase from frontend
  const {
    issueDescription,
    urgency,
    status,
    assignedTo  // expected from frontend in camelCase
  } = req.body;

  const updateFields = [];
  const updateValues = [];

  if (issueDescription !== undefined) {
    updateFields.push('issue_description = ?');
    updateValues.push(issueDescription);
  }
  if (urgency !== undefined) {
    updateFields.push('urgency = ?');
    updateValues.push(urgency);
  }
  if (status !== undefined) {
    updateFields.push('status = ?');
    updateValues.push(status);
  }
  if (assignedTo !== undefined) {
    updateFields.push('assigned_to = ?'); // converted to snake_case for DB
    updateValues.push(assignedTo);
  }

  const completedAt = (status === 'Completed') ? new Date() : null;
  if (completedAt) {
    updateFields.push('completed_at = ?');
    updateValues.push(completedAt);
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  const updateQuery = `UPDATE maintenance_requests SET ${updateFields.join(', ')} WHERE id = ?`;
  updateValues.push(requestId);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error('Error during update:', err);
      return res.status(500).json({ message: 'Database error during update', error: err });
    }

    // Fetch updated request with joined technician name
    const fetchQuery = `
      SELECT mr.*, t.name AS technician_name
      FROM maintenance_requests mr
      LEFT JOIN technicians t ON mr.assigned_to = t.id
      WHERE mr.id = ?
    `;

    db.query(fetchQuery, [requestId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Database error while fetching updated request', error: err });
      if (results.length === 0) return res.status(404).json({ message: 'Request not found' });

      const updatedRequest = results[0];

      try {
        const media = JSON.parse(updatedRequest.media_json || '[]');
        updatedRequest.media = media.map(m => ({
          file_path: m.file_path,
          file_type: m.file_type || (m.file_path?.endsWith('.mp4') ? 'video' : 'image')
        }));
      } catch {
        updatedRequest.media = [];
      }

      // Normalize keys for frontend compatibility (including requestedAt and completedAt)
      updatedRequest.assignedTo = updatedRequest.technician_name || 'Not Assigned';
      updatedRequest.propertyId = updatedRequest.property_id;
      updatedRequest.completedAt = updatedRequest.completed_at;
      updatedRequest.requestedAt = updatedRequest.created_at;

      res.json({
        message: '✅ Maintenance request updated successfully',
        request: updatedRequest
      });
    });
  });
});




// ✅ GET: Fetch Technicians
app.get('/technicians', (req, res) => {
  db.query('SELECT id, name FROM technicians', (err, results) => {
    if (err) {
      console.error('❌ Error fetching technicians:', err);
      return res.status(500).json({ message: 'Failed to fetch technicians', error: err });
    }
    res.json(results);
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
