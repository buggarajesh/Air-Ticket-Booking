const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/airticketbooking", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Define Schema and Model
const TicketSchema = new mongoose.Schema({
  passengerName: String,
  email: String,
  fromLocation: String,
  toLocation: String,
  date: String,
  journeyType: String,
  adults: Number,
  children: Number,
});

const Ticket = mongoose.model("Ticket", TicketSchema);

// GraphQL Type Definitions
const typeDefs = gql`
  type Ticket {
    id: ID!
    passengerName: String!
    email: String!
    fromLocation: String!
    toLocation: String!
    date: String!
    journeyType: String!
    adults: Int!
    children: Int!
  }

  type Query {
    getTickets: [Ticket]
  }

  type Mutation {
    addTicket(
      passengerName: String!
      email: String!
      fromLocation: String!
      toLocation: String!
      date: String!
      journeyType: String!
      adults: Int!
      children: Int!
    ): Ticket
  }
`;

// GraphQL Resolvers
const resolvers = {
  Query: {
    getTickets: async () => await Ticket.find(),
  },
  Mutation: {
    addTicket: async (_, args) => {
      const newTicket = new Ticket(args);
      return await newTicket.save();
    },
  },
};

const startServer = async () => {
  const app = express();
  app.use(cors());

  const server = new ApolloServer({ typeDefs, resolvers });

  // Fix: Await server.start() before calling server.applyMiddleware()
  await server.start();
  server.applyMiddleware({ app });

  app.listen(5000, () => {
    console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`);
  });
};

startServer();
