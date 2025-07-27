import { useEffect, useState } from "react";
import { child, get, onValue, push, ref, set, update } from "firebase/database";
import { database } from "./firebase.init";
import { Link } from "react-router";

export interface Todo {
  id: number;
  title: string;
  isCompleted: boolean;
}

function App() {
  const [title, setTitle] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);

  // add new todo
  const addNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setTodos((todos) => [...todos, { id: todos.length + 1, title, isCompleted: false }]);

    // save to db
    // push creates a new unique id for every todo after todos folder
    // so its like /todos/:uid
    const todoRef = push(ref(database, "/todos"));

    set(todoRef, {
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

  // retrieve todos from db also get latest data based on data update to
  // the specified database location
  useEffect(() => {
    const todosRef = ref(database, "/todos");

    // event listener to the todosRef
    onValue(todosRef, (snapshot) => {
      // if there are data
      if (snapshot.exists()) {
        // get todos with unique ids
        const todosWithUniqueIds = snapshot.val();

        // grab the unique id for every todo and put it inside the todo
        const todos = Object.keys(todosWithUniqueIds).map((id) => ({
          id,
          ...todosWithUniqueIds[id],
        }));

        setTodos(todos);
      }
    });
  }, []);

  // fetch data only once without observer
  // useEffect(() => {
  //   const dbRef = ref(database);

  //   get(child(dbRef, '/todos')).then((snapshot) => {
  //     if(snapshot.exists()) {
  //       setTodos(Object.values(snapshot.val()));
  //     }
  //   })
  // }, []);

  const toggleIsCompleted = (id: number, isCompleted: boolean) => {
    update(ref(database, '/posts'), {
      [`/${id}/isCompleted`]: isCompleted,
    }).then(() => {
      if(isCompleted) {
        alert('Congrats! Todo is completed!')
      } else {
        alert('Oh no! Try to complete it!');
      }
    })
  }

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
          <li key={todo.id} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={todo.isCompleted}
              onChange={(e) => toggleIsCompleted(todo.id, e.target.checked)}
            />
            <p>{todo.title}</p>
            <Link to={`/todos/edit/${todo.id}`}>Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
