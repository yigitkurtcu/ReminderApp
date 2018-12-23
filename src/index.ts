import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose'
import { startDB } from './db'
import { checkReminders } from './util/reminder'
import { resolvers } from './resolvers/index'

// Set mongodb id's ObjectId to String
const { ObjectId } = mongoose.Types
ObjectId.prototype.valueOf = () => {
  return this.toString()
}

// Connect to MongoDB
startDB()

// Check for non-send reminders
checkReminders()

// Start the GraphQL Server
export const server = new GraphQLServer({
  resolvers,
  typeDefs: './src/schema.graphql',
  context(request) {
    return {
      request
    }
  }
})

server.start(() => console.log(`🚀 Server ready at http://localhost:4000`))
