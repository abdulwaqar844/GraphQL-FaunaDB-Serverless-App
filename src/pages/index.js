import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import Completedicon from "./../Images/Completedicon.png"
import Pendingicon from "./../Images/Pendingicon.png"
import style from "./index.module.css"
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
    }`
const DELETE_TODOS = gql`
    mutation deleteTodo($id: ID!){
      deleteTodo(id: $id){
            id
        }
    }`
const UPDATE_TODO = gql`
    mutation updateTodo($status: Boolean! , $id:ID!,$task: String!){
      updateTodo(status: $status id:$id task: $task){
        id    
        status
        task
        }
    }`
export default function Index() {
  const [updateTodo] = useMutation(UPDATE_TODO);
  const handleupdate = (Obj) => {
    updateTodo({
      variables: {
        id:Obj.id,
        task:Obj.task,
        status:Obj.status
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
    console.log(Obj)
  }
  const [deleteTodo] = useMutation(DELETE_TODOS);
  const handleDelete = (id) => {
    deleteTodo({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_TODOS }]
    })
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
  if (error) {
    console.log(error)
    return <h2>Error</h2>
  }
  return (
    <div className={style.container}>
      <label>
        <h1> Add Task </h1>
        <input type="text" ref={node => {
          inputText = node;
        }} />
      </label>
      <button onClick={addTask}>Add New Task</button>
      <br /> <br />
      {loading ? (
        <div>
          <h1>Loading ....</h1>
        </div>
      ) : data.todos.length >= 1 ? (
        <table border="2" width="500px" >
          <thead>
            <tr>
              <th>Task</th>
              <th>Status</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.todos.map(d => {
              return (
                <tr key={d.id}>
                  <td className={style.task}>{d.task}</td>
                  <td className={style.pending}>{d.status ? (
                    <img style={{ width: "20px", height: "16px" }} src={Completedicon} alt="Completed Status" />
                  ) : (

                      <button onClick={() => handleupdate(d)}> <img style={{ width: "20px", height: "16px" }} src={Pendingicon} alt="Pending Status" />Mark Completed</button>
                    )
                  }
                  </td>
                  <td><button onClick={() => handleDelete(d.id)}>Delete</button></td>
                </tr>
              )
            }
            )}
          </tbody>
        </table>
      ) : (
            <div className="no-task">
              <h4>No Task for today</h4>
            </div>
          )}
    </div>
  )
}
