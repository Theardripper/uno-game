import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
    {
        endpointAccess: {
            type: String,
            required: true,
        },
        requestMethod: {
            type: String,
            required: true,
        },
        statusCode: {
            type: Number,
            required: true,
        },
        responseTime: {
            type: Number,
            required: true,
        },
        timestamp: {
            type: Date,
            required: true,
        },
        userId: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: false,
    }
);

trackingSchema.methods.toJSON = function () {
    const { _id, __v, ...rest } = this.toObject();
    return { id: _id.toString(), ...rest };
};

const TrackingLog = mongoose.model("TrackingLog", trackingSchema);

export default TrackingLog;
