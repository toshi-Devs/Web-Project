require("dotenv").config();
const express = require('express');


const router = express.Router();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});



router.get('/', async (req, res) => {
  const { category } = req.query;
  let queryText = 'SELECT * FROM posts';

  if (category) {
    queryText = `SELECT * FROM posts WHERE interest = $1`;
  }

  try {
    let posts;

    if (category) {
      posts = await pool.query(queryText, [category]);
    } else {
      posts = await pool.query(queryText);
    }

    const rows = posts.rows ? posts.rows : [];
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// Create a new post
router.post('/create', async (req, res) => {
  const { title,  url, interest, userId} = req.body;

  try {
    const newPost = await pool.query(
      'INSERT INTO posts (title, url, interest, user_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, url, interest, userId]
    );

    res.status(201).json(newPost.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

// routes/postRoute.js

// Upvote a post
router.get('/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);

    res.status(200).json(post.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch post' });
  }
}
);
router.get('/:postId/upvote', async (req, res) => {
  const postId = req.params.postId;

  try {
    const upvotes = await pool.query('SELECT upvotes FROM posts WHERE id = $1', [postId]);

    res.status(200).json(upvotes.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch upvotes' });
  }

});

// Upvote a post
// router.post('/:postId/upvote', async (req, res) => {
//   const { postId } = req.params;
//   const { userId } = req.body; // Assuming userId is sent in the request body

//   try {
//     // Check if the user has already upvoted the post
//     const existingVote = await pool.query(
//       'SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 AND vote_type = $3',
//       [userId, postId, 'upvote']
//     );

//     if (existingVote.rows.length > 0) {
//       // User has already upvoted the post
//       return res.status(400).json({ message: 'You have already upvoted this post' });
//     }

//     // Insert the upvote into the votes table
//     await pool.query(
//       'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)',
//       [userId, postId, 'upvote']
//     );

//     // Increment the upvotes count in the posts table
//     await pool.query(
//       'UPDATE posts SET upvotes = upvotes + 1 WHERE id = $1',
//       [postId]
//     );

//     res.status(200).json({ message: 'Post upvoted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to upvote post' });
//   }
// });

// // Downvote a post
// router.post('/:postId/downvote', async (req, res) => {
//   const { postId } = req.params;
//   const { userId } = req.body; // Assuming userId is sent in the request body

//   try {
//     // Check if the user has already downvoted the post
//     const existingVote = await pool.query(
//       'SELECT * FROM votes WHERE user_id = $1 AND post_id = $2 AND vote_type = $3',
//       [userId, postId, 'downvote']
//     );

//     if (existingVote.rows.length > 0) {
//       // User has already downvoted the post
//       return res.status(400).json({ message: 'You have already downvoted this post' });
//     }

//     // Insert the downvote into the votes table
//     await pool.query(
//       'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)',
//       [userId, postId, 'downvote']
//     );

//     // Increment the downvotes count in the posts table
//     await pool.query(
//       'UPDATE posts SET downvotes = downvotes + 1 WHERE id = $1',
//       [postId]
//     );

//     res.status(200).json({ message: 'Post downvoted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Failed to downvote post' });
//   }
// });


// Upvote a post
router.post('/:postId/upvote', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // Assuming userId is sent in the request body

  try {
    // Check if the user has already upvoted the post
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingVote.rows.length > 0) {
      // User has already upvoted the post
      // Delete the existing upvote
      await pool.query(
        'DELETE FROM votes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );

      // Decrement the upvotes count in the posts table
      await pool.query(
        'UPDATE posts SET upvotes = upvotes - 1 WHERE id = $1',
        [postId]
      );

      return res.status(200).json({ message: 'Upvote removed successfully' });
    }

    // Insert the upvote into the votes table
    await pool.query(
      'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)',
      [userId, postId, 'upvote']
    );

    // Increment the upvotes count in the posts table
    await pool.query(
      'UPDATE posts SET upvotes = upvotes + 1 WHERE id = $1',
      [postId]
    );

    res.status(200).json({ message: 'Post upvoted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to upvote post' });
  }
});

// Downvote a post
router.post('/:postId/downvote', async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body; // Assuming userId is sent in the request body

  try {
    // Check if the user has already downvoted the post
    const existingVote = await pool.query(
      'SELECT * FROM votes WHERE user_id = $1 AND post_id = $2',
      [userId, postId]
    );

    if (existingVote.rows.length > 0) {
      // User has already downvoted the post
      // Delete the existing downvote
      await pool.query(
        'DELETE FROM votes WHERE user_id = $1 AND post_id = $2',
        [userId, postId]
      );

      // Decrement the downvotes count in the posts table
      await pool.query(
        'UPDATE posts SET downvotes = downvotes - 1 WHERE id = $1',
        [postId]
      );

      return res.status(200).json({ message: 'Downvote removed successfully' });
    }

    // Insert the downvote into the votes table
    await pool.query(
      'INSERT INTO votes (user_id, post_id, vote_type) VALUES ($1, $2, $3)',
      [userId, postId, 'downvote']
    );

    // Increment the downvotes count in the posts table
    await pool.query(
      'UPDATE posts SET downvotes = downvotes + 1 WHERE id = $1',
      [postId]
    );

    res.status(200).json({ message: 'Post downvoted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to downvote post' });
  }
});


module.exports = router;