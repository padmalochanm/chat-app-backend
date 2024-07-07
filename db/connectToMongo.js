import mongoose from 'mongoose';

const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.log('Failed to connect to MongoDB', err));
}

export default connectToMongo