import mongoose from 'mongoose';

export const ConnectToMongo = async () => {
    try {
        const uri = process.env.MONGO_URI;
        if (!uri) {
            console.log("MONGO_URI is missing from environment variables.");
            process.exit(1);
        }

        // Monitor Mongo connection events after initial startup
        mongoose.connection.on('disconnected', () => {
            console.warn("MongoDB disconnected.");
        });

        mongoose.connection.on('error', (error) => {
            console.error(`MongoDB connection error: ${error}`);
        })

        await mongoose.connect(uri, {
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Fail fast if server isn't found in 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
            autoIndex: process.env.NODE_ENV !== "production", // Disable auto-indexing
        });

        console.log(`MongoDB Connected: ${mongoose.connection.host}`);
        return true;
    }
    catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export const disconnectFromMongo = async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
}