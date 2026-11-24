import express from 'express';

// Router for workout-related routes
const router = express.Router();

router.get('/api/workouts', async (req, res) => {
    // query mongodb database for all workouts related to this user
    
    res.json({
            id: 1,
            email: 'text@example.com'
    });
});

export default router;