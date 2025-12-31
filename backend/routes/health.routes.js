import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Detailed health check
router.get('/detailed', (req, res) => {
    res.status(200).json({
        success: true,
        server: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        },
        firebase: {
            configured: !!process.env.FIREBASE_PROJECT_ID,
            projectId: process.env.FIREBASE_PROJECT_ID || 'Not configured'
        },
        memory: {
            usage: process.memoryUsage(),
            free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed
        }
    });
});

export default router;
