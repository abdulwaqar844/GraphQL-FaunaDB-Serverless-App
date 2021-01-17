import React from "react"
import { useQuery, useMutation } from '@apollo/client';
import Completedicon from "./../Images/Completedicon.png"
import style from "./index.module.css"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Formik } from "formik"
import TextField from '@material-ui/core/TextField';
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
const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));
export default function Index() {
  const classes = useStyles();
  const [addTodo] = useMutation(ADD_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO);
  const handleupdate = (Obj) => {
    updateTodo({
      variables: {
        id: Obj.id,
        task: Obj.task,
        status: Obj.status
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


  const { loading, error, data } = useQuery(GET_TODOS);
  if (error) {
    console.log(error)
    return <h2>Error</h2>
  }
  return (
    <div className={style.container}>

      <Formik
        initialValues={{ task: '', }}
        validate={values => {
          const errors = {};
          if (!values.task) {
            errors.task = 'Required';
          }
          return errors;

        }}
        onSubmit={(values, { resetForm }) => {
          addTodo({
            variables: {
              task: values.task
            },
            refetchQueries: [{ query: GET_TODOS }]
          })
          resetForm({})

        }



        }
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          /* and other goodies */
        }) => (
          <form className={classes.root} noValidate autoComplete="off"
            onSubmit={handleSubmit}
          >
            <TextField
              id="standard-basic"
              label="Task"
              type="text"
              name="task"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.task}

            />
            {errors.task && touched.task && errors.task}


            <Button variant="contained" color="primary" type="submit"     >
              Add Task
            </Button>
          </form>
        )}
      </Formik>
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : data.todos.length >= 1 ? (
        <table className={style.data}  >
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
                  <td className={style.status}>{d.status ? (
                    <img style={{ width: "20px", height: "16px" }} src={Completedicon} alt="Completed Status" />
                  ) : (

                      <button onClick={() => handleupdate(d)}>Mark Completed</button>
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
