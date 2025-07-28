import { useContext, useEffect, useState } from "react";
import {
  child,
  get,
  off,
  onChildAdded,
  onValue,
  push,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import { database } from "./firebase";
import { Link } from "react-router";
import { AuthContext } from "./auth";

export interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

function App() {
  const authContext = useContext(AuthContext);

  const [title, setTitle] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);

  // add new todo
  const addNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // save to db
    // push creates a new unique id for every todo
    // so its like /todos/:uid/:todoId
    const todoRef = push(
      child(ref(database), `/todos/${authContext?.user?.uid}`)
    );

    set(todoRef, {
      id: todoRef.key,
      title,
      isCompleted: false,
    })
      .then(() => {
        alert("Todo is created successfully!");
      })
      .catch((error: Error) => {
        alert(`Error: ${error.message}!!`);
      });
  };

  // retrieve todos from db only once
  // or whenever authContext changes
  useEffect(() => {
    const todosRef = ref(database, `/todos/${authContext?.user?.uid}`);

    // event listener to the todosRef
    onValue(
      todosRef,
      (snapshot) => {
        // if there are data
        if (snapshot.exists()) {
          setTodos(Object.values(snapshot.val()));
        } else {
          setTodos([]);
        }
      },
      // { onlyOnce: true }
    );

    // remove value listener
    return () => off(todosRef, "value");
  }, [authContext]);

  // // add child event listeners to listen to changes
  // useEffect(() => {
  //   const todosRef = ref(database, `/todos/${authContext?.user?.uid}`);

  //   // listen to child add
  //   onChildAdded(todosRef, (addedTodo) => {
  //     const todo: Todo = {
  //       id: addedTodo.key!,
  //       title: addedTodo.val().title,
  //       isCompleted: addedTodo.val().isCompleted,
  //     };
  //     setTodos((todos) => [...todos, todo]);
  //   });

  //   return () => off(todosRef, 'child_added');
  // }, [authContext]);

  // fetch data only once without observer
  // useEffect(() => {
  //   const dbRef = ref(database);

  //   get(child(dbRef, '/todos')).then((snapshot) => {
  //     if(snapshot.exists()) {
  //       setTodos(Object.values(snapshot.val()));
  //     }
  //   })
  // }, []);

  const toggleIsCompleted = (id: string, isCompleted: boolean) => {
    update(ref(database, `/todos/${authContext?.user?.uid}`), {
      // update by specifying path for the nested keys
      [`${id}/isCompleted`]: isCompleted,
    }).then(() => {
      if (isCompleted) {
        alert("Congrats! Todo is completed!");
      } else {
        alert("Oh no! Try to complete it!");
      }
    });
  };

  // handle delete button
  const handleDelete = (id: string) => {
    remove(ref(database, `/todos/${authContext?.user?.uid}/${id}`)).then(() => {
      alert("Todo is deleted!");
    });
  };

  return (
    <div>
      <form onSubmit={addNew}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add New</button>
      </form>
      {/* todos list */}
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={(e) => toggleIsCompleted(todo.id, e.target.checked)}
            />
            <p>{todo.title}</p>
            <Link to={`/todos/edit/${todo.id}`}>Edit</Link>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
