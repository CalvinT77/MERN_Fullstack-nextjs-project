import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGODB_URI, {

        })
        console.log('MongoDb has successfully connected')
    } catch (error) {
        console('connection to MongoDB failed:', error)
        process.exit(1)
    } 
}

export default connectDB;