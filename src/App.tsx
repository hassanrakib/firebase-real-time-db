import { useEffect, useState } from "react";
import { onValue, push, ref, set } from "firebase/database";
import { database } from "./firebase.init";

interface Todo {
  id: number;
  title: string;
}

function App() {
  const [title, setTitle] = useState("");

  const [todos, setTodos] = useState<Todo[]>([]);

  // add new todo
  const addNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setTodos((todos) => [...todos, { id: todos.length + 1, title }]);

    // save to db
    const todoRef = push(ref(database, "/todos"));

    set(todoRef, {
      id: todoRef.key,
      title,
      isCompleted: false,
    }).then(() => {
      alert("Todo is created successfully!")
    }).catch((error: Error) => {
      alert(`Error: ${error.message}!!`);
    });
  };

  // retrieve todos from db
  useEffect(() => {
    const todosRef = ref(database, '/todos');

    // event listener to the todosRef
    onValue(todosRef, (snapshot) => {
      // if there are data
      if(snapshot.exists()) {
        setTodos(Object.values(snapshot.val()));
      }
    })
  }, []);

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
          <div style={{ display: "flex", gap: "10px" }}>
            <li>{todo.title}</li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default App;
