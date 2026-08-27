import TrackingLog from "#modules/tracking/tracking.model.js";

/**
 * Higher-order function that returns the tracking middleware.
 * Intercepts requests to log metadata and response time.
 */
export const apiTrack = () => {
    return (req, res, next) => {
        const start = Date.now();

        // Listen for the 'finish' event to record the log after the response is sent
        res.on("finish", async () => {
            const responseTime = Date.now() - start;

            const logData = {
                endpointAccess: req.originalUrl || req.url,
                requestMethod: req.method,
                statusCode: res.statusCode,
                responseTime,
                timestamp: new Date(start),
                userId: req.user ? (req.user.id || req.user._id?.toString()) : null,
            };

            try {
                await TrackingLog.create(logData);
            } catch (error) {
                console.error("Failed to save tracking log:", error);
            }
        });

        next();
    };
};
