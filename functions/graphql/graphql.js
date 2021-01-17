const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
    deleteTodo(id: ID!): Todo
    updateTodo(status: Boolean! ,id:ID!,task:String!): Todo
  }
  type Todo {
    id: ID!
    task: String!
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

        return result.data.map(d => {
          return {
            id: d.ref.id,
            status: d.data.status,
            task: d.data.task
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }

  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Create(
            q.Collection('todos'),
            {
              data: {
                task: task,
                status: false
              }
            },
          )
        );
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    },
    updateTodo: async (_, {id,task, status }) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Replace(
            q.Ref(q.Collection('todos'), id),
            { data: { task:task,status: true } },
          )
        );
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    },
    deleteTodo: async (_, { id }) => {
      try {
        var client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
        let result = await client.query(
          q.Delete(
            q.Ref(q.Collection('todos'), id)
          )
        ); 
        return result.ref.data;
      } catch (err) {
        return err.toString();
      }
    }
  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true
})

const handler = server.createHandler()

module.exports = { handler }
