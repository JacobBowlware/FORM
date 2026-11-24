import express from 'express';

// Router for auth-related routes
const router = express.Router();

// Get basic user info
// Eventually, this will query the database for the user info based on the JWT token in the request header.
router.get('/getUser', async (req, res) => {
    res.json({
            id: 1,
            email: 'text@example.com'
        }
    );
})

// Refresh the JWT token using the refresh token sent in the request cookie. This will return a new access token and user info.
router.get('/refresh', async (req, res) => {
    res.json({
            accessToken: 'TEST',
            user: {
                id: 1,
                email: 'user@example.com'
            }
        }
    );
})

export default router;