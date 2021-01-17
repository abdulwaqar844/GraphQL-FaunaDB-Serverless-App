   
    <Formik
        initialValues={{ task: '', }}
        validate={values => {
            const errors = {};
            if (!values.task) {
                errors.task = 'Required';
            }
            return errors;

        }}
        onSubmit={() => {
            let inputText;
            const [addTodo] = useMutation(ADD_TODO);
            addTodo({
                variables: {
                    task: inputText.value
                },
                refetchQueries: [{ query: GET_TODOS }]
            })
            inputText.value = "";
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
            isSubmitting,
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
                    value={values.name}
                    ref={node => {
                        inputText = node;
                    }}
                />
                {errors.task && touched.task && errors.task}


                <Button variant="contained" color="primary" type="submit"     >
                    Add Message
      </Button>
            </form>
        )}
    </Formik>