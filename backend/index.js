const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
// ✅ Get properties for landlord or manager with filters
const { Country } = require('country-state-city');



// App Setup
const app = express();
const port = 5000;
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
};

const requireLandlord = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });

    console.log('✅ Authenticated User:', decoded);

    if (decoded.role !== 'landlord') {
      return res.status(403).json({ message: 'Access denied: Not a landlord' });
    }

    req.user = decoded;
    next();
  });
};

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Enable CORS
app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Body parser for JSON (multipart/form-data will be handled by multer)
app.use(express.json());

// Serve static uploads folder
app.use('/uploads', express.static(uploadDir));

// DB Connection
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

// Role Enum
const UserRole = {
  Admin: 'admin',
  Landlord: 'landlord',
  PropertyManager: 'propertymanager',
  Tenant: 'tenant'
};

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } }); // limit 10MB

// Register Endpoint
app.post('/api/register', (req, res) => {
  const { email, password, role } = req.body;
  const normalizedRole = role?.toLowerCase();

  if (!email || !password || !normalizedRole) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  if (!Object.values(UserRole).includes(normalizedRole)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  const insertQuery = 'INSERT INTO users (email, password, role, created_at) VALUES (?, ?, ?, NOW())';

  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists' });

    db.query(insertQuery, [email, password, normalizedRole], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error inserting user', error: err });
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const user = results[0];
    if (user.password !== password) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  });
});

// Add Property (Landlords only) with image upload
// ✅ Save properties with ISO country code
app.post('/api/properties', requireLandlord, upload.array('images', 5), (req, res) => {
  const {
    name, title, description, price,
    country, state, city, street,
    status, type
  } = req.body;

  const allowedStatuses = ['available', 'rented'];
  const normalizedStatus = status?.toLowerCase();

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status. Must be "available" or "rented".' });
  }

  const imageUrls = req.files?.map(file => `/uploads/${file.filename}`) || [];

  if (
    !name || !title || !description || !price ||
    !country || !state || !city || !street ||
    !status || !type || imageUrls.length === 0
  ) {
    return res.status(400).json({ message: 'All fields including at least one image are required.' });
  }

  const address = `${street}, ${city}, ${state}, ${country}`;
  const landlordId = req.user.id;

  // 🛠️ Save ISO country code as sent by frontend
  console.log('🌐 Received ISO Country Code:', country); // 👈 Debug log

  const sql = `
    INSERT INTO properties 
      (name, title, description, price, image_url, address, status, type, landlord_id, country, state, city)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      title,
      description,
      parseFloat(price),
      imageUrls[0],
      address,
      normalizedStatus,
      type,
      landlordId,
      country, // This should be ISO code from frontend
      state,
      city
    ],
    (err, result) => {
      if (err) {
        console.error('❌ Database error:', err);
        return res.status(500).json({ message: 'Failed to add property' });
      }

      res.status(201).json({
        message: '🏡 Property added successfully!',
        propertyId: result.insertId,
        imageUrls
      });
    }
  );
});


// ✅ Fetch active properties only
app.get('/api/properties/active', authenticateJWT, (req, res) => {
  const query = `
    SELECT 
      id, title, description, price, address, image_url, status, name, type
    FROM properties
    WHERE status IN (?, ?)
    ORDER BY created_at DESC
  `;

  db.query(query, ['Available', 'Rented'], (err, results) => {
    if (err) {
      console.error('❌ Error fetching active properties:', err.sqlMessage || err.message);
      return res.status(500).json({ message: 'Failed to fetch active properties', error: err.sqlMessage || err.message });
    }

    console.log('✅ Active properties fetched:', results);
    res.status(200).json(results);
  });
});

// Helper function to convert country name to ISO code
function getCountryIsoCode(countryName) {
  if (!countryName) return null;
  const country = Country.getAllCountries().find(
    c => c.name.toLowerCase() === countryName.toLowerCase()
  );
  return country ? country.isoCode : null;
}

app.get('/api/properties', authenticateJWT, (req, res) => {
  const userId = req.user.id;
  const userRole = req.user.role;
  console.log(`📡 Fetching properties for ${userRole} with ID: ${userId}`);

  const {
    city = '',
    state = '',
    country = '',
    minPrice = 0,
    maxPrice = 9999999999999999999,
    type = '',
    page = 1,
    limit = 10
  } = req.query;

  const offset = (parseInt(page) - 1) * parseInt(limit);
  const countryCode = getCountryIsoCode(country);

  console.log('🧭 Filters:', {
    city,
    state,
    country,
    minPrice,
    maxPrice,
    type,
    page,
    limit
  });

  let baseQuery = `
    SELECT 
      p.id, 
      p.title, 
      p.description, 
      p.price, 
      p.address, 
      p.image_url,
      p.status,
      p.name,
      p.type
    FROM properties p
    WHERE (LOWER(p.status) = 'available' OR LOWER(p.status) = 'rented')
  `;

  const params = [];

  if (userRole === UserRole.Landlord) {
    baseQuery += ` AND p.landlord_id = ?`;
    params.push(userId);
  } else if (userRole === UserRole.PropertyManager) {
    baseQuery += ` AND p.manager_id = ?`;
    params.push(userId);
  } else {
    return res.status(403).json({ message: 'Unauthorized access: role not allowed' });
  }

  if (city && city.trim() !== '') {
    baseQuery += ` AND p.city = ?`;
    params.push(city);
  }

  if (state && state.trim() !== '') {
    baseQuery += ` AND p.state = ?`;
    params.push(state);
  }

  if (countryCode && countryCode.trim() !== '') {
    baseQuery += ` AND p.country = ?`;
    params.push(countryCode);
  } else if (country && country.trim() !== '') {
    baseQuery += ` AND p.country = ?`;
    params.push(country);
  }

  if (type && type.trim() !== '') {
    baseQuery += ` AND p.type = ?`;
    params.push(type);
  }

  baseQuery += ` AND p.price BETWEEN ? AND ?`;
  params.push(parseFloat(minPrice), parseFloat(maxPrice));

  baseQuery += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  console.log('📄 SQL Query:', baseQuery);
  console.log('📄 Query Params:', params);

  db.query(baseQuery, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching properties:', err.sqlMessage || err.message);
      return res.status(500).json({ message: 'Failed to fetch properties', error: err.sqlMessage || err.message });
    }

    console.log('✅ Properties fetched:', results);
    res.status(200).json(results);
  });
});

// ============================
// GET Single Property Details by ID
// ============================
app.get('/api/properties/:id', authenticateJWT, (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  console.log('🔐 Requested by user:', userId, 'role:', userRole);
  console.log('🔍 Property ID:', propertyId);

  let query = `
    SELECT 
      p.id, p.title, p.name, p.address, p.type, p.price, p.image_url,
      p.description, p.status, p.city, p.state, p.country,
      l.start_date AS leaseStartDate,
      l.end_date AS leaseEndDate,
      l.lease_agreement_url AS leaseAgreement,
      CONCAT(u.first_name, ' ', u.last_name) AS tenantName,
      u.contact AS tenantContact,
      u.email AS tenantEmail -- ✅ ADDED THIS LINE
    FROM properties p
    LEFT JOIN leases l ON p.id = l.property_id
    LEFT JOIN users u ON l.tenant_id = u.id AND u.role = 'tenant'
    WHERE p.id = ?
  `;

  const params = [propertyId];

  if (userRole === 'landlord') {
    query += ' AND p.landlord_id = ?';
    params.push(userId);
  } else if (userRole === 'property-manager') {
    query += ' AND p.manager_id = ?';
    params.push(userId);
  } else if (userRole === 'tenant') {
    // Tenant can only access properties they lease
    query += `
      AND EXISTS (
        SELECT 1 FROM leases l2
        WHERE l2.property_id = p.id AND l2.tenant_id = ?
      )
    `;
    params.push(userId);
  } else if (userRole === 'admin') {
    // Admins can access any property, no extra filter
  } else {
    return res.status(403).json({ message: 'Unauthorized access: role not allowed' });
  }

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('❌ Error fetching property:', err);
      return res.status(500).json({ message: 'Error fetching property details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Property not found or access denied' });
    }

    res.json(results[0]);
  });
});

// DELETE a specific property by ID (only if it belongs to the landlord)
app.delete('/api/properties/:id', requireLandlord, (req, res) => {
  const propertyId = req.params.id;
  const landlordId = req.user.id;

  const sql = `DELETE FROM properties WHERE id = ? AND landlord_id = ?`;

  db.query(sql, [propertyId, landlordId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting property:', err);
      return res.status(500).json({ message: 'Failed to delete property' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Property not found or unauthorized' });
    }

    res.status(200).json({ message: '🗑️ Property deleted successfully' });
  });
});

// DELETE all properties owned by the currently logged-in landlord
app.delete('/api/properties', requireLandlord, (req, res) => {
  const landlordId = req.user?.id;

  if (!landlordId) {
    return res.status(401).json({ message: 'Unauthorized: landlord ID not found' });
  }

  console.log('Deleting all properties for landlord ID:', landlordId); // DEBUG

  const sql = `DELETE FROM properties WHERE landlord_id = ?`;

  db.query(sql, [landlordId], (err, result) => {
    if (err) {
      console.error('❌ Error deleting all properties:', err);
      return res.status(500).json({ message: 'Failed to delete all properties' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No properties found to delete for this landlord' });
    }

    res.status(200).json({
      message: `🧹 All properties deleted for landlord (ID: ${landlordId})`,
      affectedRows: result.affectedRows
    });
  });
});




// Assign tenant to a property (Landlord or PropertyManager only)
app.post('/api/properties/:id/assign-tenant', authenticateJWT, (req, res) => {
  const propertyId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;
  const { tenantId, leaseStartDate, leaseEndDate, leaseAgreementUrl } = req.body;

  if (!tenantId || !leaseStartDate || !leaseEndDate) {
    return res.status(400).json({ message: 'Missing tenant ID or lease dates' });
  }

  if (!['landlord', 'propertymanager'].includes(userRole)) {
    return res.status(403).json({ message: 'Unauthorized: only landlord or property manager can assign tenant' });
  }

  const ownershipColumn = userRole === 'landlord' ? 'landlord_id' : 'manager_id';

  const checkPropertyQuery = `SELECT id FROM properties WHERE id = ? AND ${ownershipColumn} = ?`;
  db.query(checkPropertyQuery, [propertyId, userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(403).json({ message: 'Property not found or access denied' });

    const upsertLeaseQuery = `
      INSERT INTO leases (property_id, tenant_id, start_date, end_date, lease_agreement_url)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        tenant_id = VALUES(tenant_id),
        start_date = VALUES(start_date),
        end_date = VALUES(end_date),
        lease_agreement_url = VALUES(lease_agreement_url)
    `;

    db.query(upsertLeaseQuery, [propertyId, tenantId, leaseStartDate, leaseEndDate, leaseAgreementUrl || null], (err2) => {
      if (err2) return res.status(500).json({ message: 'Failed to assign tenant', error: err2 });

      const updateStatusQuery = `UPDATE properties SET status = 'rented' WHERE id = ?`;
      db.query(updateStatusQuery, [propertyId], (err3) => {
        if (err3) return res.status(500).json({ message: 'Failed to update property status', error: err3 });

        res.status(200).json({ message: 'Tenant assigned successfully' });
      });
    });
  });
});

app.get('/api/users/tenants', authenticateJWT, (req, res) => {
  const query = `SELECT id, first_name, last_name, email, contact FROM users WHERE role = 'tenant'`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    res.json(results);
  });
});







// ============================
// POST Invite Link
// ============================
app.post('/api/invite', (req, res) => {
  try {
    const token = uuidv4(); // Generate UUID
    const inviteLink = `https://yourapp.com/register?invite=${token}`;

    // TODO: Save token to DB here (optional)

    res.json({ inviteLink });
  } catch (error) {
    console.error('Error generating invite:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const { v4: uuidv4 } = require('uuid');






// Get Users by Role
app.get('/api/users', authenticateJWT, (req, res) => {
  const role = req.query.role;
  if (!role) return res.status(400).json({ message: 'Role parameter is required' });

  const query = 'SELECT id, name FROM users WHERE role = ?';

  db.query(query, [role.toLowerCase()], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ message: 'Database error', error: err });
    }
    res.json(results);
  });
});



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
