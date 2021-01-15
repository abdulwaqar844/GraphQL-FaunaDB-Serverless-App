import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const GET_TODOS = gql`
{
  todos
  {
  id
  task
  status
}} `
const ADD_TODO = gql`
    mutation addTodo($task: String!){
        addTodo(task: $task){
            task
        }
    }
`
export default function Index() {
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
          <th>Task</th>
          <th>Status</th>
        </thead>
        <tbody>
          {data.todos.map(d => {
            return (
              <tr key={d.id}>
                <td>{d.task}</td>
                <td>{d.status ? "Pending" : "Completed"}</td>
              </tr>
            )
          }
          )}
        </tbody>
      </table>

    </div>
  )
}