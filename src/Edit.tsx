import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { db } from "./firebase";
import { AuthContext } from "./auth";

export default function Edit() {
  const { id } = useParams();

  const authContext = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    db.ref(`/todos/${authContext?.user?.uid}/${id}`).on("value", (snapshot) => {
      if (snapshot.exists()) {
        const todo = snapshot.val();

        setTitle(todo.title);
        setIsCompleted(todo.isCompleted);
      }
    });
  }, [authContext, id]);

  // update todo
  const updateTodo = async () => {
    try {
      await db.ref(`/todos/${authContext?.user?.uid}/${id}`).update({
        title,
        isCompleted,
      });
      alert("Todo updated successfully!");
    } catch (error: unknown) {
      console.log((error as Error).message);
    }
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
        <button type="button" onClick={async () => await updateTodo()}>
          Update
        </button>
      </form>
    </div>
  );
}
