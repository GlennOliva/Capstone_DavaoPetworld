const express = require('express');
const cors = require('cors');
const db = require('./dbcon');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { request } = require('http');
const nodemailer = require('nodemailer');
const http = require('http');
const socketIo = require('socket.io');
const app = express();


// Enable CORS for all origins or restrict it to specific origin(s)
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include PUT, DELETE, and OPTIONS
  credentials: true, // Allow cookies if needed
}));


const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
      origin: 'http://localhost:5173', // Allow your frontend origin
      methods: ['GET', 'POST', 'PUT', 'DELETE'], // Include PUT and DELETE
  },
});

app.options('*', cors()); // Respond to all preflight requests



io.on('connection', (socket) => {
  console.log('A client connected');

  // Handle joining a room
  socket.on('joinRoom', ({ roomId }) => {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);
  });

  // Handle incoming messages
  socket.on('message', (message) => {
    console.log('Received message:', message);

    // Broadcast the message to the specific room
    io.to(message.roomId).emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const bcrypt = require('bcrypt');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads folder for storing images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.use(cors());
app.use(bodyParser.json());

app.use(express.json());

app.get('/', (request, response) => {
    return response.json("Starting the node server..");
});




app.get('/admin', (request , response) => {
    const sql = "SELECT * FROM tbl_admin";
    db.query(sql , (error, data) => {
        if(error) return response.json(error);
        return response.json(data);
    });
});



app.get('/seller', (request , response) => {
  const sql = "SELECT * FROM tbl_seller";
  db.query(sql , (error, data) => {
      if(error) return response.json(error);
      return response.json(data);
  });
});

app.get('/seller/:id', (request, response) => {
  const id = request.params.id;
  console.log("id: " + id);
  const sql = "SELECT * FROM tbl_seller WHERE id = ?";
  db.query(sql, [id], (error, data) => {
      if (error) return response.json(error);
      return response.json(data);
  });
});


app.get('/admin/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_admin WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.put('/edit_admin/:id', upload.single('image'), (request, response) => {
    const id = request.params.id;
    const { first_name, last_name, email, password, store_name, status } = request.body;
    const image = request.file ? request.file.filename : null;

    const sql = 'UPDATE tbl_admin SET first_name = ?, last_name = ?, email = ?, password = ?, store_name = ?, status = ?, image = ? WHERE id = ?';

    db.query(sql, [first_name, last_name, email, password, store_name, status, image, id], (error, result) => {
        if (error) {
            return response.status(500).json({ error: 'Error updating admin' });
        }
        response.json({ message: 'Admin Successfully Updated!' });
    });
});



app.post('/add_admin', upload.single('image'), (request, response) => {
    const { first_name, last_name, email, password, store_name, status } = request.body;
    const image = request.file ? request.file.filename : null; // Get the uploaded image file name
    
    const sql = "INSERT INTO tbl_admin (first_name, last_name, email, image, password, store_name, status) VALUES (?, ?, ?, ?, ?, ?, 'Active')";
    db.query(sql, [first_name, last_name, email, image, password, store_name, status], (error, result) => {
        if (error) {
            return response.status(500).send('Error creating admin');
        }
        response.send('Admin Successfully Created!');
    });
});

app.delete('/admin/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM tbl_admin WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return response.status(500).send('Error creating admin');
        }
        response.send('Admin Successfully Deleted!');
    });
});

//users crud function

app.get('/user', (request , response) => {
    const sql = "SELECT * FROM tbl_user";
    db.query(sql , (error, data) => {
        if(error) return response.json(error);
        return response.json(data);
    });
});

app.get('/user/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_user WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});
app.put('/edit_profile/:id', upload.single('image'), (request, response) => {
    const id = request.params.id;
    const { first_name, last_name, email, password, birthdate, gender, bio, age, address } = request.body;
    const image = request.file ? request.file.filename : null;

    // Log the incoming request details for debugging
    console.log('Update Request Details:', {
        id,
        first_name,
        last_name,
        email,
        password,
        birthdate,
        gender,
        bio,
        age,
        address,
        image
    });

    const sql = `
        UPDATE tbl_user 
        SET 
          first_name = ?, 
          last_name = ?, 
          email = ?, 
          birthdate = ?, 
          gender = ?, 
          image = ?, 
          password = ?, 
          bio = ?, 
          age = ?, 
          address = ? 
        WHERE id = ?
    `;

    db.query(sql, [first_name, last_name, email, birthdate, gender, image, password, bio, age, address, id], (error, result) => {
        if (error) {
            // Log the error details
            console.error('Error updating user:', error.code, error.sqlMessage); // Log error code and message
            return response.status(500).json({ error: 'Error updating user' });
        }

        // Check if any rows were affected
        if (result.affectedRows === 0) {
            console.warn(`No user found with id: ${id}`); // Log a warning if no rows were updated
            return response.status(404).json({ message: 'No user found to update' });
        }

        response.json({ message: 'User Successfully Updated!' });
    });
});


app.get('/search_users', (req, res) => {
    const query = req.query.query;
  
    const sql = `
      SELECT * FROM tbl_user
      WHERE first_name LIKE ? OR last_name LIKE ? OR CONCAT(first_name, ' ', last_name) LIKE ?
    `;
    
    const searchPattern = `%${query}%`;
  
    db.query(sql, [searchPattern, searchPattern, searchPattern], (error, results) => {
      if (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Error fetching users' });
      }
      res.json(results);
    });
  });
 
  
  app.post('/register_user', upload.single('image'), (req, res) => {
    try {
      // Access form fields from the request body
      const { first_name, last_name, email, password, birthdate, gender, bio, address, age, terms } = req.body;
      const image = req.file;  // Image data from the uploaded file
  
      // Check if required fields are missing
      if (!first_name || !last_name || !email || !password || !terms) {
        return res.status(400).json({ message: 'Required fields missing' });
      }
  
      // If an image is uploaded, get the image filename (not the full path)
      const imageFilename = image ? image.filename : null; // Only the filename, not the path
  
      // Format the birthdate to ensure it is valid (assuming birthdate is in yyyy-mm-dd format)
      const formattedBirthdate = birthdate ? new Date(birthdate).toISOString().split('T')[0] : null;
  
      // Set status to 'Active' by default
      const status = 'Active';
  
      // Insert user data into the database
      const query = `
        INSERT INTO tbl_user (first_name, last_name, email, password, birthdate, gender, bio, address, age, status, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      // Perform the database query
      db.query(query, [first_name, last_name, email, password, formattedBirthdate, gender, bio, address, age, status, imageFilename], (err, results) => {
        if (err) {
          // Log the specific database error for debugging
          console.error('Database error:', err);
          return res.status(500).json({ message: 'Database Error', error: err.message });
        }
  
        // Success response
        res.status(200).json({ message: 'User registered successfully' });
      });
  
    } catch (err) {
      // Log any unexpected errors
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
  });


  app.post('/register_seller', upload.fields([{ name: 'profile_pic' }, { name: 'valid_id' }]), (req, res) => {
    try {
      const { first_name, last_name, email, password, gender, terms } = req.body;
      const profilePic = req.files['profile_pic']?.[0];
      const validId = req.files['valid_id']?.[0];
  
      if (!first_name || !last_name || !email || !password || !terms) {
        return res.status(400).json({ message: 'All required fields must be filled' });
      }
  
      if (!profilePic || !validId) {
        return res.status(400).json({ message: 'Profile picture and valid ID are required' });
      }
  
      const profilePicUrl = profilePic.filename;
      const validIdUrl = validId.filename;
  
      const query = 'INSERT INTO tbl_seller (first_name, last_name, email, password, gender, image, valid_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [first_name, last_name, email, password, gender, profilePicUrl, validIdUrl];
  
      db.query(query, values, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Seller registered successfully' });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  
  
  



//post content
app.get('/post', (request, response) => {
    const sql = `
        SELECT p.*, u.first_name 
        FROM tbl_post p 
        JOIN tbl_user u ON p.user_id = u.id`; // Adjust 'user_id' and 'id' to match your actual column names

    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});

app.delete('/post/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM tbl_post WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return response.status(500).send('Error creating post');
        }
        response.send('Post Successfully Deleted!');
    });
});

app.delete('/seller/:id', (request, response) => {
  const id = request.params.id;
  const sql = 'DELETE FROM tbl_seller WHERE id = ?';
  db.query(sql, [id], (error, result) => {
      if (error) {
          return response.status(500).send('Error Deleting Seller');
      }
      response.send('Seller Successfully Deleted!');
  });
});


app.post('/add_post', upload.single('image'), (request, response) => {
    const { user_id, post_description, status } = request.body; // Ensure user_id is being destructured
    const image = request.file ? request.file.filename : null; // Get the uploaded image file name
    
    const sql = "INSERT INTO tbl_post (user_id, post_description, image, created_at,  status) VALUES (?, ?, ?, NOW(), ?)";
    db.query(sql, [user_id, post_description, image, status], (error, result) => {
        if (error) {
            console.error('Database error:', error); // Log the error for debugging
            return response.status(500).send('Error creating post');
        }
        response.send('Post Successfully Created!');
    });
});


app.get('/fetch_post', (request, response) => {
    const sql = `
        SELECT 
            tbl_post.*, 
            original_user.first_name AS creator_first_name, 
            original_user.last_name AS creator_last_name, 
            original_user.image AS creator_image,
            shared_user.first_name AS sharer_first_name,
            shared_user.last_name AS sharer_last_name,
            shared_user.image AS sharer_image,
            tbl_share.id as share_id,
            tbl_share.share_description,
            tbl_share.created_at AS share_created_at
        FROM tbl_post
        JOIN tbl_user AS original_user 
            ON tbl_post.user_id = original_user.id
        LEFT JOIN tbl_share 
            ON tbl_post.id = tbl_share.post_id
        LEFT JOIN tbl_user AS shared_user 
            ON tbl_share.user_id = shared_user.id  -- Join for the user who shared the post
    `;

    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.get('/fetch_post_profile', (request, response) => {
    const userId = request.query.user_id; // Get the user_id from query parameters

    const sql = `
        SELECT 
            tbl_post.*, 
            original_user.first_name AS creator_first_name, 
            original_user.last_name AS creator_last_name, 
            original_user.image AS creator_image,
            shared_user.first_name AS sharer_first_name,
            shared_user.last_name AS sharer_last_name,
            shared_user.image AS sharer_image,
            tbl_share.id as share_id,
            tbl_share.share_description,
            tbl_share.created_at AS share_created_at
        FROM tbl_post
        JOIN tbl_user AS original_user 
            ON tbl_post.user_id = original_user.id
        LEFT JOIN tbl_share 
            ON tbl_post.id = tbl_share.post_id
        LEFT JOIN tbl_user AS shared_user 
            ON tbl_share.user_id = shared_user.id  -- Join for the user who shared the post
        WHERE tbl_post.user_id = ?  -- Filter posts by the user_id
        ORDER BY tbl_post.created_at DESC;  -- Optional: Order posts by creation date
    `;

    // Execute the SQL query
    db.query(sql, [userId], (error, data) => {
        if (error) {
            console.error('Error fetching posts:', error);
            return response.status(500).json({ error: 'Failed to fetch posts' });
        }
        
        // Return the data in JSON format
        return response.json(data);
    });
});






//react post
app.post('/react', (req, res) => {
    const { userId, postId, reactionType } = req.body;

    const query = `
      INSERT INTO tbl_reaction (user_id, post_id, reaction_type)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE reaction_type = ?;`;

    db.query(query, [userId, postId, reactionType, reactionType], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json({ message: 'Reaction updated successfully' });
    });
});

app.post('/comment', (req, res) => {
    const { userId, postId, commentDescription } = req.body;
  
    // Check if all required fields are provided
    if (!userId || !postId || !commentDescription) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const query = `
      INSERT INTO tbl_comment (user_id, post_id, comment_description, created_at)
      VALUES (?, ?, ?, NOW())`;
  
    db.query(query, [userId, postId, commentDescription], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Assuming result.insertId is available to get the ID of the newly inserted comment
      res.status(201).json({
        message: 'Comment added successfully',
        commentId: result.insertId // Optionally return the new comment ID
      });
    });
  });


  app.get('/fetch_comment', (req, res) => {
    const postId = req.query.post_id; // Get the post_id from the query parameters

    // SQL query to fetch comments based on post_id and join with tbl_user
    const query = `
        SELECT 
            c.*, 
            u.image AS user_image, 
            u.first_name, 
            u.last_name 
        FROM 
            tbl_comment c 
        JOIN 
            tbl_user u ON c.user_id = u.id 
        WHERE 
            c.post_id = ?`; // Filter comments by post_id

    // Execute the query
    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Database error:', err); // Log error for debugging
            return res.status(500).json({ error: 'Database error' }); // Send error response
        }

        // Send results back as JSON response
        res.status(200).json(results);
    });
});


app.get('/fetch_comment_count/:postId', (req, res) => {
    const postId = req.params.postId; // Get postId from the URL parameters
    const query = `SELECT COUNT(*) AS total FROM tbl_comment WHERE post_id = ?`; // Your SQL query

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ total: results[0].total }); // Return the count
    });
});

app.get('/fetch_share_count/:postId', (req, res) => {
    const postId = req.params.postId; // Get postId from the URL parameters
    const query = `SELECT COUNT(*) AS total FROM tbl_share WHERE post_id = ?`; // Your SQL query

    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ total: results[0].total }); // Return the count
    });
});

app.post('/insert_reply', (req, res) => {
    const { post_id, user_id, reply_description, comment_id } = req.body;

    const query = `INSERT INTO tbl_reply (post_id, user_id, comment_id, reply_description, created_at) 
                   VALUES (?, ?, ?, ?, NOW())`; // Ensure all values are included

    db.query(query, [post_id, user_id, comment_id, reply_description], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Reply added successfully' }); // Send success response
    });
});


app.post('/share_post', (req, res) => {
    const { post_id, user_id, share_description, comment_id } = req.body;

    const query = `INSERT INTO tbl_share (post_id, user_id, share_description, created_at) 
                   VALUES (?, ?, ?, NOW())`; // Ensure all values are included

    db.query(query, [post_id, user_id,share_description], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ message: 'Share post successfully' }); // Send success response
    });
});


app.get('/fetch_replies', (req, res) => {
    const { comment_id } = req.query;

    // SQL query to fetch replies associated with the comment_id
    const query = `SELECT r.id, r.reply_description, r.created_at, u.first_name, u.last_name, u.image AS user_image
                   FROM tbl_reply r
                   JOIN tbl_user u ON r.user_id = u.id
                   WHERE r.comment_id = ?`;

    db.query(query, [comment_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results); // Send fetched replies as the response
    });
});









app.get('/reactions/:postId', (req, res) => {
    const postId = req.params.postId; // This should be retrieving the postId from the URL parameters
    console.log('postId:', postId); // Log to verify it's received correctly

    const query = `SELECT COUNT(*) as total FROM tbl_reaction WHERE post_id = ?;`;
    
    db.query(query, [postId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Query Results:', results); // Log results for debugging
        res.status(200).json(results[0]); // Return the total count
    });
});












//category function
// Add a new category
app.post('/add_category',  upload.single('image'), (request, response) => {
    const { category_name, seller_id } = request.body;
    const image = request.file ? request.file.filename : null; // Get the filename from the uploaded file

    console.log('Received category_name:', category_name);
    console.log('Received seller_id:', seller_id);

    const sql = "INSERT INTO tbl_category (category_name, seller_id, image, status) VALUES (?, ?, ?, 'Active')";
    db.query(sql, [category_name, seller_id, image], (error, result) => {
        if (error) {
            console.error('Error executing query:', error);
            return response.status(500).send('Error creating category');
        }
        response.json({ message: 'Category Successfully Created!' });
    });
});



app.get('/category', (request, response) => {
    const sql = `SELECT * FROM tbl_category`; 

    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});

app.delete('/category/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM tbl_category WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return response.status(500).send('Error creating post');
        }
        response.send('Category Successfully Deleted!');
    });
});

app.get('/category/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_category WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.put('/edit_category/:id', upload.single('image'), (request, response) => {
    const id = request.params.id;
    const { category_name, status } = request.body;
    const image = request.file ? request.file.filename : null; // Get the filename from the uploaded file
    const sql = 'UPDATE tbl_category SET category_name  = ?, image = ?,  status = ? WHERE id = ?';

    db.query(sql, [category_name, image, status, id], (error, result) => {
        if (error) {
            return response.status(500).json({ error: 'Error updating category' });
        }
        response.json({ message: 'Category Successfully Updated!' });
    });
});


//products function
app.post('/add_product', upload.single('image'), (request, response) => {
    const { seller_id, category_id, product_name, product_price, product_quantity, product_description } = request.body;
    const image = request.file ? request.file.filename : null; // Get the filename from the uploaded file

    const sql = "INSERT INTO tbl_product (seller_id, category_id, image, product_name, product_price, product_quantity, product_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'Active')";

    db.query(sql, [seller_id, category_id, image, product_name, product_price, product_quantity, product_description], (error, result) => {
        if (error) {
            console.error('Error executing query:', error); // Log the error details
            return response.status(500).send('Error creating product'); // Update the error message
        }
        response.json({ message: 'Product Successfully Created!' }); // Send a JSON response
    });
});


app.get('/product', (request, response) => {
  const sellerId = request.query.seller_id; // Assuming seller_id is passed as a query parameter
  const sql = `
      SELECT p.*, c.category_name
      FROM tbl_product p
      JOIN tbl_category c ON p.category_id = c.id
      WHERE p.seller_id = ?
  `;
  
  db.query(sql, [sellerId], (error, data) => {
      if (error) return response.json(error);
      return response.json(data);
  });
});



app.delete('/product/:id', (request, response) => {
    const id = request.params.id;
    const sql = 'DELETE FROM tbl_product WHERE id = ?';
    db.query(sql, [id], (error, result) => {
        if (error) {
            return response.status(500).send('Error deleting product');
        }
        response.send('Product Successfully Deleted!');
    });
});

app.get('/product/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);
    const sql = "SELECT * FROM tbl_product WHERE id = ?";
    db.query(sql, [id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});


app.put('/edit_product/:id', upload.single('image'), (request, response) => {
    const id = request.params.id;
    const { category_id, product_name, product_price, product_quantity, product_description } = request.body;
    const image = request.file ? request.file.filename : null;

    const sql = `
        UPDATE tbl_product 
        SET 
            category_id = ?, 
            product_name = ?, 
            product_price = ?, 
            product_quantity = ?, 
            product_description = ?, 
            image = ?
        WHERE id = ?
    `;

    db.query(sql, [category_id, product_name, product_price, product_quantity, product_description, image, id], (error, result) => {
        if (error) {
            console.error('Error updating product:', error); // Log the error details
            return response.status(500).json({ error: 'Error updating product' });
        }
        response.json({ message: 'Product Successfully Updated!' });
    });
});



//login logics

// Admin Login (without bcrypt)
// Admin Login (without bcrypt)
app.post('/admin/login', (request, response) => {
    const { email, password } = request.body; // Ensure this is declared first
    const sql = `SELECT * FROM tbl_admin WHERE email = ?`;

    db.query(sql, [email], (error, data) => {
        if (error) return response.status(500).json({ error: 'Database error' });

        // Check if admin exists
        if (data.length === 0) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const admin = data[0];

        // Compare plain-text passwords
        if (password !== admin.password) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        // If successful, return admin data (without password)
        const { password: _, ...adminData } = admin; // Avoid conflict with variable name
        return response.json({ message: 'Login successful', admin: adminData });
    });
});


app.post('/seller/login', (request, response) => {
  const { email, password } = request.body; // Extract email and password from the request body
  const sql = `SELECT * FROM tbl_seller WHERE email = ?`;

  db.query(sql, [email], (error, data) => {
      if (error) return response.status(500).json({ error: 'Database error' });

      // Check if seller exists
      if (data.length === 0) {
          return response.status(401).json({ error: 'Invalid email or password' });
      }

      const seller = data[0];

      // Compare plain-text passwords
      if (password !== seller.password) {
          return response.status(401).json({ error: 'Invalid email or password' });
      }

      // If successful, return seller data (without password)
      const { password: _, ...sellerData } = seller; // Exclude password from the response
      return response.json({ message: 'Login successful', seller: sellerData });
  });
});





app.post('/user/login', (request, response) => {
    const { email, password } = request.body; // Ensure this is declared first
    const sql = `SELECT * FROM tbl_user WHERE email = ?`;

    db.query(sql, [email], (error, data) => {
        if (error) return response.status(500).json({ error: 'Database error' });

        // Check if user exists
        if (data.length === 0) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        const user = data[0];

        // Compare plain-text passwords
        if (password !== user.password) {
            return response.status(401).json({ error: 'Invalid email or password' });
        }

        // If successful, return user data (without password)
        const { password: _, ...userData } = user; // Avoid conflict with variable name
        return response.json({ message: 'Login successful', user: userData });
    });
});



//counts of users, products , orders , categories
// Backend API to count users
app.get('/no_user', (request , response) => {
    const sql = "SELECT COUNT(*) AS user_count FROM tbl_user";
    db.query(sql , (error, data) => {
        if(error) return response.json(error);
        return response.json(data[0]);  // Return the count of users
    });
});


//counts of users, products , orders , categories
// Backend API to count users
app.get('/no_seller', (request , response) => {
  const sql = "SELECT COUNT(*) AS seller_count FROM tbl_seller";
  db.query(sql , (error, data) => {
      if(error) return response.json(error);
      return response.json(data[0]);  // Return the count of users
  });
});



// Backend API to count orders
app.get('/no_post', (request , response) => {
    const sql = "SELECT COUNT(*) AS post_count FROM tbl_post";
    db.query(sql , (error, data) => {
        if(error) return response.json(error);
        return response.json(data[0]);  // Return the count of orders
    });
});


app.get('/no_order', (request, response) => {
  const { seller_id } = request.query;

  if (!seller_id) {
    return response.status(400).json({ error: "Seller ID is required" });
  }

  const sql = "SELECT COUNT(*) AS order_count FROM tbl_order WHERE seller_id = ?";
  db.query(sql, [seller_id], (error, data) => {
    if (error) {
      return response.status(500).json({ error: "Database query error", details: error });
    }
    return response.json(data[0]);
  });
});


app.get('/no_category', (request, response) => {
  const { seller_id } = request.query;

  if (!seller_id) {
    return response.status(400).json({ error: "Seller ID is required" });
  }

  const sql = "SELECT COUNT(*) AS category_count FROM tbl_category WHERE seller_id = ?";
  db.query(sql, [seller_id], (error, data) => {
    if (error) {
      return response.status(500).json({ error: "Database query error", details: error });
    }
    return response.json(data[0]);
  });
});



app.get('/no_product', (request, response) => {
  const { seller_id } = request.query; // Extract seller_id from the query parameters

  if (!seller_id) {
    return response.status(400).json({ error: "Seller ID is required" });
  }

  const sql = "SELECT COUNT(*) AS product_count FROM tbl_product WHERE seller_id = ?";
  db.query(sql, [seller_id], (error, data) => {
    if (error) {
      return response.status(500).json({ error: "Database query error", details: error });
    }
    return response.json(data[0]); // Return the count of products for the seller
  });
});


app.get('/no_seller_user', (request, response) => {
  const sql = `
    SELECT 'Users' AS type, COUNT(*) AS count FROM tbl_user
    UNION ALL
    SELECT 'Sellers' AS type, COUNT(*) AS count FROM tbl_seller;
  `;

  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error fetching user and seller counts:', error);
      return response.status(500).json({ error: 'Internal Server Error' });
    }

    // Format the data for the frontend
    const data = results.reduce((acc, row) => {
      acc[row.type.toLowerCase()] = row.count;
      return acc;
    }, {});

    return response.json(data);
  });
});


app.get('/no_products', (request, response) => {
  const { startDate, endDate } = request.query; // Get startDate and endDate from query params

  // Create the SQL query with a filter for the date range if provided
  let sql = `
    SELECT c.category_name, COUNT(p.id) AS count
    FROM tbl_product p
    JOIN tbl_category c ON p.category_id = c.id
  `;

  // Add the date filter if startDate and endDate are provided
  if (startDate && endDate) {
    sql += ` WHERE p.created_at BETWEEN ? AND ?`;  // Assuming `created_at` is the field to filter by
  }

  sql += ` GROUP BY c.category_name;`;

  // Execute the query
  db.query(sql, [startDate, endDate], (error, data) => {
    if (error) return response.json({ error: error.message });
    return response.json(data);  // Return the counts of each product category
  });
});




app.get('/no_revenues', (request, response) => {
  const { seller_id, start_date, end_date } = request.query; // Extract seller_id, start_date, and end_date from the query parameters

  if (!seller_id) {
    return response.status(400).json({ error: "Seller ID is required" });
  }

  // Start with a basic SQL query
  let sql = `
    SELECT 
      MONTH(created_at) AS month, 
      YEAR(created_at) AS year,
      SUM(total_price) AS total_revenue
    FROM 
      tbl_order
    WHERE 
      seller_id = ? AND
      status = 'Delivered'
  `;

  // Add date filtering if provided
  if (start_date) {
    sql += ` AND created_at >= ?`;
  }
  if (end_date) {
    sql += ` AND created_at <= ?`;
  }

  sql += ` GROUP BY YEAR(created_at), MONTH(created_at) ORDER BY YEAR(created_at), MONTH(created_at)`;

  // Run the query with appropriate parameters
  const params = [seller_id];
  if (start_date) params.push(start_date);
  if (end_date) params.push(end_date);

  db.query(sql, params, (error, data) => {
    if (error) {
      return response.status(500).json({ error: "Database query error", details: error });
    }

    // Return an array of data with month, year, and total_revenue
    response.json(data); // This will return an array of objects like [{year: 2024, month: 1, total_revenue: 495}, ...]
  });
});



app.get('/no_revenue', (request, response) => {
  const { seller_id } = request.query; // Extract seller_id from the query parameters

  if (!seller_id) {
    return response.status(400).json({ error: "Seller ID is required" });
  }

  const sql = `
    SELECT 
      SUM(total_price) AS total_revenue
    FROM 
      tbl_order
    WHERE 
      seller_id = ? AND
      status = 'Delivered'
  `;
  
  db.query(sql, [seller_id], (error, data) => {
    if (error) {
      return response.status(500).json({ error: "Database query error", details: error });
    }
    return response.json({ total_revenue: data[0].total_revenue || 0 }); // Return the total revenue for the seller
  });
});






app.put('/edit_adminprofile/:id', upload.single('image'), (request, response) => {
  const id = request.params.id;
  const { first_name, last_name, email, password, store_name } = request.body;
  const image = request.file ? request.file.filename : null;

  const sql = 'UPDATE tbl_admin SET first_name = ?, last_name = ?, email = ?, password = ?, store_name = ?, image = ? WHERE id = ?';

  db.query(sql, [first_name, last_name, email, password, store_name, image, id], (error, result) => {
      if (error) {
          console.error('Error updating admin:', error); // Log the error for better understanding
          return response.status(500).json({ error: 'Error updating admin', details: error });
      }
      response.json({ message: 'Admin Successfully Updated!' });
  });
});



app.put('/edit_sellerprofile/:id', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'valid_id', maxCount: 1 }
]), (request, response) => {
  const id = request.params.id;
  const { first_name, last_name, email, password, store_name } = request.body;
  const image = request.files['image'] ? request.files['image'][0].filename : null;
  const valid_id = request.files['valid_id'] ? request.files['valid_id'][0].filename : null;

  const sql = 'UPDATE tbl_seller SET first_name = ?, last_name = ?, email = ?, password = ?, store_name = ?, valid_id = ?, image = ? WHERE id = ?';

  db.query(sql, [first_name, last_name, email, password, store_name, valid_id, image, id], (error, result) => {
    if (error) {
      console.error('Error updating seller:', error);
      return response.status(500).json({ error: 'Error updating seller', details: error });
    }
    response.json({ message: 'Seller Successfully Updated!' });
  });
});




//notificaiton
app.get('/notifications/:user_id', (req, res) => {
    const userId = req.params.user_id;
    const query = `
    SELECT 'comment' as type, c.comment_description as content, u.first_name, u.image, c.created_at
    FROM tbl_comment c
    JOIN tbl_post p ON c.post_id = p.id
    JOIN tbl_user u ON c.user_id = u.id
    WHERE p.user_id = ?
    
    UNION
    
    SELECT 'reaction' as type, r.reaction_type as content, u.first_name, u.image, r.created_at
    FROM tbl_reaction r
    JOIN tbl_post p ON r.post_id = p.id
    JOIN tbl_user u ON r.user_id = u.id
    WHERE p.user_id = ?
    
    UNION
    
    SELECT 'reply' as type, rp.reply_description as content, u.first_name, u.image, rp.created_at
    FROM tbl_reply rp
    JOIN tbl_comment c ON rp.comment_id = c.id
    JOIN tbl_user u ON rp.user_id = u.id
    WHERE c.user_id = ?
    
    UNION
    
    SELECT 'share' as type, s.share_description as content, u.first_name, u.image, s.created_at
    FROM tbl_share s
    JOIN tbl_post p ON s.post_id = p.id
    JOIN tbl_user u ON s.user_id = u.id
    WHERE p.user_id = ?
    
    ORDER BY created_at DESC
    `;

    db.query(query, [userId, userId, userId, userId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});



//fetch categories  from ecommerce side
app.get('/categories', (request, response) => {
    const sql = `
      SELECT * FROM tbl_category;
    `;
    db.query(sql, (error, data) => {
        if (error) return response.json(error);
        return response.json(data);  // Return the counts of each product category
    });
});


// Fetch products by category_id
app.get('/fetch_product_category/:category_id', (request, response) => {
    const { category_id } = request.params;
    const sql = `
      SELECT tbl_product.*, 
             tbl_category.category_name, 
             tbl_seller.store_name
      FROM tbl_product
      JOIN tbl_category ON tbl_product.category_id = tbl_category.id
      JOIN tbl_seller ON tbl_product.seller_id = tbl_seller.id  -- Join with tbl_admin
      WHERE tbl_product.category_id = ?;
    `;
    db.query(sql, [category_id], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);  // Return the filtered product, category, and admin data
    });
});

// Fetch products from eCommerce side
app.get('/ecommerce_product', (request, response) => {
    const sql = `
        SELECT p.*, s.store_name
        FROM tbl_product p
        JOIN tbl_seller s ON p.seller_id = s.id
        LIMIT 6;
    `;
    
    // Execute the SQL query
    db.query(sql, (error, data) => {
        if (error) {
            console.error("Database Query Error: ", error); // Log error for debugging
            return response.status(500).json({ error: error.message }); // Return error with 500 status
        }
        
        console.log("Fetched Products: ", data); // Log fetched data
        return response.json(data);  // Return the list of products with store names
    });
});

// Fetch products from eCommerce side
app.get('/ecommerce_products', (request, response) => {
  const sql = `
      SELECT p.*, s.store_name
      FROM tbl_product p
      JOIN tbl_seller s ON p.seller_id = s.id
  `;
  
  // Execute the SQL query
  db.query(sql, (error, data) => {
      if (error) {
          console.error("Database Query Error: ", error); // Log error for debugging
          return response.status(500).json({ error: error.message }); // Return error with 500 status
      }
      
      console.log("Fetched Products: ", data); // Log fetched data
      return response.json(data);  // Return the list of products with store names
  });
});


app.get('/product_details/:id', (request, response) => {
    const productId = request.params.id;  // Get the product id from the request params
  
    const sql = `
      SELECT tbl_product.*, 
             tbl_category.category_name, 
             tbl_seller.store_name
      FROM tbl_product
      JOIN tbl_category ON tbl_product.category_id = tbl_category.id
      JOIN tbl_seller ON tbl_product.seller_id = tbl_seller.id  -- Join with tbl_admin
      WHERE tbl_product.id = ?;  -- Use the product ID here, not category ID
    `;
  
    // Execute the SQL query, passing the productId as a parameter
    db.query(sql, [productId], (error, data) => {
      if (error) {
        console.error("Database Query Error: ", error); // Log error for debugging
        return response.status(500).json({ error: error.message }); // Return error with 500 status
      }
  
      // Check if the product exists
      if (data.length === 0) {
        return response.status(404).json({ message: "Product not found" });
      }
  
      console.log("Fetched Product: ", data[0]); // Log the fetched product data
      return response.json(data[0]);  // Return the specific product data
    });
  });






  app.get('/fetch_post', (request, response) => {
    const sql = `
   SELECT DATE_FORMAT(created_at, '%Y-%m') AS post_month, COUNT(*) AS post_count 
FROM tbl_post 
GROUP BY post_month 
ORDER BY post_month
    `;

    // Execute the SQL query
    db.query(sql, (error, data) => {
        if (error) {
            console.error("Database Query Error: ", error); // Log error for debugging
            return response.status(500).json({ error: error.message }); // Return error with 500 status
        }
        
        console.log("Fetched counts of posts by month: ", data); // Log fetched data
        return response.json(data);  // Return the counts of posts grouped by month
    });
});




app.post('/addcart', (req, res) => {
  const { product_id, user_id, quantity } = req.body;
  
  // First, check if the product is in stock
  const checkStockQuery = 'SELECT product_quantity FROM tbl_product WHERE id = ?';
  
  db.query(checkStockQuery, [product_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to check product stock' });
    }
    
    // If no product found or product_quantity is 0, return error
    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found!' });
    }
    
    const availableStock = result[0].product_quantity;

    // Check if the requested quantity is greater than the available stock
    if (quantity > availableStock) {
      return res.status(400).json({ error: 'Sorry, insufficient stock available.' });
    }

    // If the product is in stock, add it to the cart
    const addToCartQuery = 'INSERT INTO tbl_cart (product_id, user_id, quantity) VALUES (?, ?, ?)';
    
    db.query(addToCartQuery, [product_id, user_id, quantity], (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to add to cart' });
      }
      res.status(200).json({ message: 'Item added to cart successfully' });
    });
  });
});




  app.get('/products_cart', (req, res) => {
    const userId = req.query.user_id || 1; // Assume user_id is passed or use a default (e.g., from a session)
    
    const query = `
      SELECT 
        p.product_name,
        p.product_price,
        p.image,
        s.store_name,
        c.category_name,
        ca.quantity,
        ca.id,
        ca.product_id,
        (p.product_price * ca.quantity) AS subtotal
      FROM tbl_cart ca 
      JOIN tbl_product p ON ca.product_id = p.id
      JOIN tbl_seller s ON p.seller_id = s.id
      JOIN tbl_category c ON p.category_id = c.id
      WHERE ca.user_id = ?;
    `;
    
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error("SQL Error:", err); // Log the error
        return res.status(500).json({ error: "Error fetching cart products", details: err });
      }
      res.json(results);
    });
});


  app.get('/cart_count', (req, res) => {
    const userId = req.query.user_id; // Get user_id from query params
  
    const query = 'SELECT COUNT(*) as count FROM tbl_cart WHERE user_id = ?';
    db.query(query, [userId], (error, results) => {
      if (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ error: 'Database error' });
      }
  
      // Return the count in the response
      res.json({ count: results[0].count });
    });
  });


  app.post('/remove_cart_item', (req, res) => {
    const { id } = req.body; // Get the cart_id from the request body
  
    const query = 'DELETE FROM tbl_cart WHERE id = ?'; // SQL query to delete from tbl_cart
    db.query(query, [id], (error, results) => {
      if (error) {
        console.error("Error executing query:", error);
        return res.status(500).json({ success: false, message: 'Internal server error' });
      }
  
      if (results.affectedRows > 0) {
        res.json({ success: true, message: 'Product removed successfully' });
      } else {
        res.json({ success: false, message: 'Product not found' });
      }
    });
  });
  

  
  
// API to fetch user details
app.get('/get_user/:id', (req, res) => {
    const userId = req.params.id;
    const query = `SELECT first_name, last_name FROM tbl_user WHERE id = ?`;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching user data:', err);
        return res.status(500).json({ error: 'Failed to fetch user data' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json(result[0]);
    });
  });
  
  

  // API to fetch cart details and join with product information
  app.get('/get_cart/:id', (req, res) => {
    const userId = req.params.id;
    const query = `
      SELECT tbl_product.product_name, tbl_product.product_description, tbl_cart.total_price
      FROM tbl_cart
      JOIN tbl_product ON tbl_cart.product_id = tbl_product.id
      WHERE tbl_cart.user_id = ?`;
  
    db.query(query, [userId], (err, result) => {
      if (err) {
        console.error('Error fetching cart data:', err);
        return res.status(500).json({ error: 'Failed to fetch cart data' });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ message: 'Cart is empty' });
      }
  
      res.json(result);
    });
  });



  app.post('/checkout', (req, res) => {
    console.log('Request body:', req.body); // Log the incoming request body

    const { 
        user_id, 
        product_id,  
        product_name,
        product_quantity, 
        total_price, 
        payment_method, 
        address, 
        shipfee,
        sub_total,
        transaction_id // Add transaction_id here
    } = req.body;

    // Validate required fields
    if (!user_id || !product_id || !product_name || !product_quantity || !total_price || !payment_method || !address || !shipfee || !sub_total) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // If the payment method is COD, generate a random transaction_id
    let generatedTransactionId = transaction_id;
    if (payment_method === "cod") {
        generatedTransactionId = `COD-${Math.floor(Math.random() * 1000000)}`; // Random ID prefixed with "COD"
    }

    const status = 'Pending';
    const product_ids = Array.isArray(product_id) ? product_id.join(', ') : product_id; // Ensure it's a string

    // Ensure product_quantity is an array
    const quantities = Array.isArray(product_quantity) ? product_quantity : [product_quantity];

    // Check if the lengths of product_id and quantities match
    if (product_id.length !== quantities.length) {
        return res.status(400).json({ error: 'Mismatched product ID and quantity lengths' });
    }

    // Function to get seller_id for each product
    const getSellerIds = product_id.map(id => {
        return new Promise((resolve, reject) => {
            const sellerQuery = `
                SELECT p.seller_id
                FROM tbl_product p
                WHERE p.id = ?
            `;
            db.query(sellerQuery, [id], (err, result) => {
                if (err) {
                    reject(`Error fetching seller ID for product ID ${id}: ${err}`);
                }
                if (result.length === 0) {
                    reject(`Product with ID ${id} not found.`);
                } else {
                    resolve(result[0].seller_id);
                }
            });
        });
    });

    // Handle multiple seller IDs concurrently
    Promise.all(getSellerIds)
        .then(seller_ids => {
            if (new Set(seller_ids).size > 1) {
                // If products belong to different sellers, decide how to proceed (split orders or handle differently)
                return res.status(400).json({ error: 'Products belong to different sellers' });
            }

            // Now we can proceed with order insertion (assuming the seller IDs match)
            const query = `
            INSERT INTO tbl_order (
                user_id, 
                product_id, 
                product_name,
                product_quantity,  
                total_price, 
                payment_method, 
                address, 
                shipping_fee, 
                status,
                seller_id,
                sub_total,
                transaction_id
            ) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

            const quantityToInsert = quantities.join(','); // Store as a comma-separated string

            // Insert the order with seller_id (from the first seller_id, as all are assumed to be the same now)
            db.query(query, [
              user_id, 
              product_ids, 
              product_name,
              quantityToInsert, 
              total_price, 
              payment_method, 
              address, 
              shipfee, 
              status,
              seller_ids[0], // Insert the seller_id (same for all products)
              sub_total,
              generatedTransactionId  // Use the generated transaction_id
          ], (err, result) => {
              if (err) {
                  console.error('Error saving order:', err);
                  return res.status(500).json({ error: 'Failed to save order' });
              }

                // Deduct the product quantities from tbl_product
                const updatePromises = product_id.map((id, index) => {
                    return new Promise((resolve, reject) => {
                        const updateQuery = `
                            UPDATE tbl_product 
                            SET product_quantity = product_quantity - ? 
                            WHERE id = ?
                        `;

                        db.query(updateQuery, [quantities[index], id], (err, updateResult) => {
                            if (err) {
                                console.error(`Error updating product quantity for product ID ${id}:`, err);
                                reject(err);
                            } else {
                                resolve(updateResult);
                            }
                        });
                    });
                });

                // Execute all update promises
                Promise.all(updatePromises)
                    .then(() => {
                        // Delete all items from tbl_cart for the user after successful order placement
                        const deleteQuery = 'DELETE FROM tbl_cart WHERE user_id = ?';
                        
                        db.query(deleteQuery, [user_id], (err) => {
                            if (err) {
                                console.error('Error deleting items from cart:', err);
                                return res.status(500).json({ error: 'Failed to delete cart items' });
                            }

                            res.status(200).json({ message: 'Order placed and product quantities updated successfully, cart cleared' });
                        });
                    })
                    .catch(err => {
                        console.error('Error updating product quantities:', err);
                        res.status(500).json({ error: 'Failed to update product quantities' });
                    });
            });
        })
        .catch(err => {
            console.error('Error retrieving seller IDs:', err); // Log the error
            res.status(500).json({ error: err });
        });
});




app.get('/api/orders', (req, res) => {
  const { user_id } = req.query;
  let query = `
      SELECT 
          o.id, 
          o.transaction_id,
          u.first_name, 
          u.last_name, 
          o.product_name, 
          o.product_quantity, 
          o.payment_method, 
          o.total_price, 
          o.status, 
          o.shipping_fee, 
          o.created_at, 
          o.address
      FROM tbl_order AS o
      JOIN tbl_user AS u ON o.user_id = u.id
  `;

  // Add a WHERE clause if user_id is provided
  if (user_id) {
      query += ` WHERE o.user_id = ?`;
  }

  db.query(query, [user_id], (err, results) => {
    if (err) throw err;
    console.log(results); // Log the results to see the returned data
    res.json(results);
});

});




app.get('/manage_order', (request, response) => {
    const sellerId = request.query.seller_id; // Assume seller_id is passed as a query parameter
    const sql = `
        SELECT 
            tbl_order.id, 
            tbl_order.transaction_id,
            tbl_order.product_name, 
            tbl_order.product_quantity, 
            tbl_order.payment_method, 
            tbl_order.total_price, 
            tbl_order.status,
            tbl_order.address,
            tbl_order.shipping_fee,
            tbl_user.first_name, 
            tbl_user.last_name,
            tbl_order.created_at
        FROM tbl_order
        JOIN tbl_user ON tbl_order.user_id = tbl_user.id
        WHERE tbl_order.status != 'Delivered'
        AND tbl_order.seller_id = ?`; // Filter by seller_id

    db.query(sql, [sellerId], (error, data) => {
        if (error) return response.json(error);
        return response.json(data);
    });
});



app.get('/manage_income', (request, response) => {
  const sellerId = request.query.seller_id; // Assume seller_id is passed as a query parameter
  const sql = `
      SELECT 
          tbl_order.id, 
          tbl_order.product_name, 
          tbl_order.product_quantity, 
          tbl_order.payment_method, 
          tbl_order.total_price, 
          tbl_order.status,
          tbl_order.address,
          tbl_order.shipping_fee,
          tbl_user.first_name, 
          tbl_user.last_name
      FROM tbl_order
      JOIN tbl_user ON tbl_order.user_id = tbl_user.id
      WHERE tbl_order.status = 'Delivered'
      AND tbl_order.seller_id = ?;`; // Filter by seller_id

  db.query(sql, [sellerId], (error, data) => {
      if (error) return response.json(error);
      return response.json(data);
  });
});



app.get('/manage_order/:id', (request, response) => {
    const id = request.params.id;
    console.log("id: " + id);

    // Updated SQL query with JOIN
    const sql = `
        SELECT o.*, u.first_name, u.last_name 
        FROM tbl_order o 
        JOIN tbl_user u ON o.user_id = u.id 
        WHERE o.id = ?`;

    db.query(sql, [id], (error, data) => {
        if (error) {
            return response.status(500).json({ error: 'Error fetching order data' });
        }
        if (data.length === 0) {
            return response.status(404).json({ message: 'Order not found' });
        }
        return response.json(data[0]); // Return the first matching order
    });
});



app.put('/edit_order/:id', (request, response) => {
    const id = request.params.id;
    const {  status } = request.body;

    const sql = 'UPDATE tbl_order SET status = ? WHERE id = ?';

    db.query(sql, [ status, id], (error, result) => {
        if (error) {
            return response.status(500).json({ error: 'Error updating order status' });
        }
        response.json({ message: 'Order status Successfully Updated!' });
    });
});





app.get('/revenue_sales', (request, response) => {
  const { seller_id } = request.query; // Get seller_id from query parameters

  if (!seller_id) {
      return response.status(400).json({ error: 'Seller ID is required' });
  }

  const sql = `
      SELECT 
          YEAR(created_at) AS year,
          MONTH(created_at) AS month,
          SUM(total_price) AS total_revenue
      FROM 
          tbl_order
      WHERE 
          status = 'Delivered'
          AND seller_id = ?
      GROUP BY 
          YEAR(created_at), MONTH(created_at)
      ORDER BY 
          year, month
  `;

  db.query(sql, [seller_id], (error, result) => {
      if (error) {
          return response.status(500).json({ error: 'Error fetching revenue sales', details: error });
      }
      response.json(result); // Send the aggregated revenue sales data
  });
});


app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
  
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
  
    // Query the database to check if the email exists
    const query = 'SELECT * FROM tbl_user WHERE email = ?';
  
    db.query(query, [email], async (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Failed to check email. Please try again later.' });
      }
  
      if (results.length === 0) {
        // Email not found in the database
        return res.status(404).json({ error: 'Email not recognized' });
      }
  
      // Email exists, proceed with sending the reset link
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      const resetLink = `http://localhost:5173/changepass?email=${encodeURIComponent(email)}`;
  
      const mailOptions = {
        from: 'Davao Pet World',
        to: email,
        subject: 'Password Reset Request',
        html: `
          <h2>Password Reset</h2>
          <p>Hello there,</p>
          <p>This is from Davao Pet World. Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
      };
  
      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Password reset link sent successfully' });
      } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email. Please try again later.' });
      }
    });
  });


  app.post('/change-password', (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
  
    // Check if the email exists
    const query = 'SELECT * FROM tbl_user WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ error: 'Failed to process the request. Please try again later.' });
      }
  
      if (results.length === 0) {
        // Email not found in the database
        return res.status(404).json({ error: 'Email not found.' });
      }
  
      // Update the password if the email exists
      const updateQuery = 'UPDATE tbl_user SET password = ? WHERE email = ?';
      db.query(updateQuery, [password, email], (updateErr) => {
        if (updateErr) {
          console.error('Failed to update password:', updateErr);
          return res.status(500).json({ error: 'Failed to update password. Please try again later.' });
        }
  
        res.status(200).json({ message: 'Password updated successfully.' });
      });
    });
  });
  


  app.get('/api/payment-method-stats', (req, res) => {
    const { seller_id, start_date, end_date } = req.query;  // Extract seller_id and date filters

    if (!seller_id) {
        return res.status(400).json({ error: "Seller ID is required" });
    }

    // Start building the query
    let query = `
      SELECT payment_method, COUNT(*) AS total_sales
      FROM tbl_order
      WHERE seller_id = ? AND status = 'Delivered'
    `;

    // Add date filters if provided
    const params = [seller_id];
    if (start_date) {
        query += ` AND created_at >= ?`;
        params.push(start_date);
    }
    if (end_date) {
        query += ` AND created_at <= ?`;
        params.push(end_date);
    }

    // Group by payment method and order by total sales
    query += `
      GROUP BY payment_method
      ORDER BY total_sales DESC;
    `;

    // Execute the query
    db.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database query failed' });
        }

        const mostPreferred = results.length > 0 ? results[0] : null;
        res.json({ data: results, mostPreferred });
    });
});




  // Fetch order details by ID
app.get('/api/order/:id', (req, res) => {
    const orderId = req.params.id;

    const query = `
    SELECT 
      o.id AS order_id,
      o.transaction_id,
      o.created_at,
      o.product_name,
      o.product_quantity,
      o.product_id,   -- Add product_id to get the product IDs
      o.total_price,
      o.payment_method,
      o.shipping_fee,
      o.sub_total,    -- Include sub_total from the database
      u.email,
      CONCAT(u.first_name, ' ', u.last_name) AS full_name,
      u.address,
      p.product_price -- Fetch product_price from tbl_product
    FROM 
      tbl_order o
    JOIN 
      tbl_user u ON o.user_id = u.id
    JOIN 
      tbl_product p ON o.product_id = p.id -- Join with tbl_product based on product_id
    WHERE 
      o.id = ?;
  `;
  
  db.query(query, [orderId], (err, results) => {
      if (err) {
          console.error('Error fetching order details:', err);
          res.status(500).json({ error: 'Failed to fetch order details' });
      } else if (results.length === 0) {
          res.status(404).json({ error: 'Order not found' });
      } else {
          res.status(200).json(results[0]); // Send the single order result
      }
  });
  
});

  
  // Fetch all orders for downloading receipts
app.get('/api/manage_income_all', (req, res) => {
    // Query to get all order details along with user details
    const query = `
      SELECT 
        o.id AS order_id, o.created_at, o.product_name, o.product_quantity, 
        o.total_price, o.payment_method, o.shipping_fee, 
        u.email, CONCAT(u.first_name, ' ', u.last_name) AS full_name, u.address, o.status
      FROM 
        tbl_order o
      JOIN 
        tbl_user u ON o.user_id = u.id;
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching all data:', err);
        res.status(500).json({ error: 'Failed to fetch all order data' });
      } else if (results.length === 0) {
        res.status(404).json({ error: 'No order data found' });
      } else {
        res.status(200).json(results); // Send all order data
      }
    });
  });
  
  



app.listen(8081, () => {
    console.log("Listening on port 8081");
});