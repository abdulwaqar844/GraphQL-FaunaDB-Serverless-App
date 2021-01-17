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
  console.log(data)
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
    const GET_TODOS = gql`
{
  BookMarks  {
  id
  title
  url
}
} `