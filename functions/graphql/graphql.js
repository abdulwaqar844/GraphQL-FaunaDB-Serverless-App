const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;
const typeDefs = gql`
  type Query {
    todos:[Todo!]
  }
  type Todo {
    id: ID!
    name: String!
    status: Boolean!
  }
`


const resolvers = {
  Query: {
    todos: async (parent, args, context) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index('todo-index'))),
            q.Lambda(x => q.Get(x))
          )
          );
        return        result.data;
      } catch (err) {
        return err.toString();
        
      }
    }
    
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

const handler = server.createHandler()

module.exports = { handler }
