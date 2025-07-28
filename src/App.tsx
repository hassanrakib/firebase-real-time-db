import { useContext, useEffect, useState } from "react";
import { db, firestoreDB } from "./firebase";
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

  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  // add new todo (using firebase realtime database)
  // const addNew = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   try {
  //     // create a reference to write at this db location
  //     const todoRef = db.ref(`todos/${authContext?.user?.uid}`).push();

  //     // save to db
  //     await todoRef.set({
  //       id: todoRef.key,
  //       title,
  //       isCompleted: false,
  //     });
  //     alert("Todo is created successfully!");
  //   } catch (error: unknown) {
  //     alert(`Error: ${(error as Error).message}!!`);
  //   }
  // };

  // add new todo (using firebase firestore)
  const addNew = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const todoRef = firestoreDB
        .collection("todos")
        .doc(authContext?.user?.uid)
        .collection("items")
        .doc();

      todoRef.set({
        id: todoRef.id,
        title,
        isCompleted: false,
      });

      alert("Todo is created successfully!");
    } catch (error: unknown) {
      alert((error as Error).message);
    }
  };

  // // retrieve todos from db (using realtime database)
  // useEffect(() => {
  //   const todosRef = db.ref(`/todos/${authContext?.user?.uid}`);

  //   let todosQuery;

  //   if (filter === "incomplete") {
  //     todosQuery = todosRef.orderByChild("isCompleted").equalTo(false);
  //   } else if (filter === "completed") {
  //     todosQuery = todosRef.orderByChild("isCompleted").equalTo(true);
  //   } else {
  //     todosQuery = todosRef;
  //   }

  //   // event listener to the todosQuery
  //   todosQuery.on("value", (snapshot) => {
  //     // if there are data
  //     if (snapshot.exists()) {
  //       setTodos(Object.values(snapshot.val()));
  //     } else {
  //       setTodos([]);
  //     }
  //   });

  //   // remove value listener
  //   return () => todosRef.off("value");
  // }, [authContext, filter]);

  // using firestore to retrieve the entire collection

  // fetch todos (using firebase firestore)
  useEffect(() => {
    const fetchTodos = async () => {
      const todosRef = firestoreDB
        .collection("todos")
        .doc(authContext?.user?.uid)
        .collection("items");

      let todosQuery;

      if (filter === "incomplete") {
        todosQuery = todosRef.where("isCompleted", "==", false);
      } else if (filter === "completed") {
        todosQuery = todosRef.where("isCompleted", "==", true);
      } else {
        todosQuery = todosRef;
      }

      const querySnapshot = await todosQuery.get();

      const todos = querySnapshot.docs.map((doc) => doc.data() as Todo);

      setTodos(todos);
    };

    fetchTodos();
  }, [authContext, filter]);

  // update isCompleted state (using firebase realtime database);
  // const toggleIsCompleted = async (id: string, isCompleted: boolean) => {
  //   try {
  //     await db.ref(`todos/${authContext?.user?.uid}`).update({
  //       [`${id}/isCompleted`]: isCompleted,
  //     });
  //     alert("Congrats! Todo is completed!");
  //   } catch (error: unknown) {
  //     console.log((error as Error).message);
  //     alert("Oh no! Try to complete it!");
  //   }
  // };

  // update isCompleted state (using firebase firestore)
  const toggleIsCompleted = async (id: string, isCompleted: boolean) => {
    try {
      await firestoreDB
        .collection("todos")
        .doc(authContext?.user?.uid)
        .collection("items")
        .doc(id)
        .update({
          isCompleted,
        });

      alert("Congrats! Todo is completed!");
    } catch (error: unknown) {
      console.log((error as Error).message);
      alert("Oh no! Try to complete it!");
    }
  };

  // handle delete button
  const handleDelete = async (id: string) => {
    try {
      await db.ref(`/todos/${authContext?.user?.uid}/${id}`).remove();
      alert("Todo is deleted!");
    } catch (error: unknown) {
      console.log((error as Error).message);
    }
  };

  // filter incomplete todos
  const toggleFilter = () => {
    setFilter((filter) => {
      if (filter === "all") {
        return "incomplete";
      } else if (filter === "incomplete") {
        return "completed";
      } else {
        return "all";
      }
    });
  };

  return (
    <div>
      <form onSubmit={async (e) => await addNew(e)}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add New</button>
      </form>
      {/* filter todos */}
      <div style={{ margin: "30px 0" }}>
        <button onClick={toggleFilter}>
          Showing {filter.toUpperCase()} Todos. Click to change filtering
        </button>
      </div>
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
              onChange={async (e) =>
                await toggleIsCompleted(todo.id, e.target.checked)
              }
            />
            <p>{todo.title}</p>
            <Link to={`/todos/edit/${todo.id}`}>Edit</Link>
            <button onClick={async () => await handleDelete(todo.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
