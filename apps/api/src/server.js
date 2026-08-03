import { env } from '#config/env.js';
import { connectDB } from '#config/db.js';
import { createApp } from '#app.js';

/**
 * Server entry point.
 * Connects to the database, creates the app, and starts listening.
 */
async function start() {
    try {
        await connectDB();

        const app = createApp();
        const PORT = env.PORT;

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📚 Documentation at http://localhost:${PORT}/api-docs`);
        });
    } catch (error) {
        console.error('💥 Failed to start server:', error.message);
        process.exit(1);
    }
}

start();
