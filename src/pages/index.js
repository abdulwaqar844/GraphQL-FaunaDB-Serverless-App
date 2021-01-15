import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TODOS = gql`
{
  todos  {
  id
  task
  status
}
} `
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`
const DELETE_TODOS = gql`
    mutation deleteTodo($id: ID!){
      deleteTodo(id: $id){
            id
        }
    }
`
export default function Index() {
  const [deleteTodo] = useMutation(DELETE_TODOS);
  const handleDelete = (id) => {
    deleteTodo({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    console.log("Form Index" ,id)
    console.log("Form Functions" ,deleteTodo)

  }
  let inputText;
  const [addTodo] = useMutation(ADD_TODO);
  const addTask = () => {
    addTodo({
      variables: {
        task: inputText.value
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    inputText.value = "";
  }

  const { loading, error, data } = useQuery(GET_TODOS);
  if (loading)
    return <h2>Loading..</h2>
  if (error) {
    console.log(error)
    return <h2>Error</h2>
  }
  return (
    <div>
      <label>
        <h1> Add Task </h1>
        <input type="text" ref={node => {
          inputText = node;
        }} />
      </label>
      <button onClick={addTask}>Add New Task</button>

      <br /> <br />
      <table border="2" width="500px" >
        <thead>      
        <tr>
          <th>Task</th>
          <th>Status</th>
        </tr>
  </thead>
        <tbody>
          {data.todos.map(d => {
            return (
              <tr key={d.id}>
                <td>{d.task}</td>
                <td>{d.status ? "Pending" : "Completed"}</td>
                <td><button onClick={() => handleDelete(d.id)}>Delete</button></td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>

    </div>
  )
}