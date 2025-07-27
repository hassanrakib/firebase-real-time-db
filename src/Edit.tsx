import { onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { database } from "./firebase.init";

export default function Edit() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const todoRef = ref(database, `/todos/${id}`);

    onValue(todoRef, (snapshot) => {
      if (snapshot.exists()) {
        const todo = snapshot.val();

        setTitle(todo.title);
        setIsCompleted(todo.isCompleted);
      }
    });
  }, [id]);

  // update todo
  const updateTodo = () => {
    const todoRef = ref(database, `/todos/${id}`);

    set(todoRef, {
      title,
      isCompleted,
    }).then(() => {
      alert("Todo updated successfully!");
    });
  };

  return (
    <div>
      <h3>Edit Todo</h3>
      <form>
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={() => setIsCompleted((isCompleted) => !isCompleted)}
        />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="button" onClick={updateTodo}>Update</button>
      </form>
    </div>
  );
}
