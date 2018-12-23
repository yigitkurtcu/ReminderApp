import mongoose from 'mongoose'
import secrets from '../config'

export const startDB = async () => {
  // Connect to MongoDB
  const mongoUrl = secrets.MONGODB_URI
  mongoose
    .connect(
      mongoUrl,
      { useNewUrlParser: true }
    )
    .then(() => {
      console.log('MongoDB connected')
    })
    .catch(err => {
      console.log(
        'MongoDB connection error. Please make sure MongoDB is running. ' + err
      )
    })
}
