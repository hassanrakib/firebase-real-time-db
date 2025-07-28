import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { firestoreDB } from "./firebase";
import { AuthContext } from "./auth";
import type { Todo } from "./App";

export default function Edit() {
  const { id } = useParams();

  const authContext = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  // // fetch specific to do (using firebase realtime database)
  // useEffect(() => {
  //   db.ref(`/todos/${authContext?.user?.uid}/${id}`).on("value", (snapshot) => {
  //     if (snapshot.exists()) {
  //       const todo = snapshot.val();

  //       setTitle(todo.title);
  //       setIsCompleted(todo.isCompleted);
  //     }
  //   });
  // }, [authContext, id]);

  // fetch specific to do (using firebase firestore)
  useEffect(() => {
    firestoreDB
      .collection("todos")
      .doc(authContext?.user?.uid)
      .collection("items")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const todo = doc.data() as Todo;

          setTitle(todo.title);
          setIsCompleted(todo.isCompleted);
        }
      });
  }, [authContext, id]);

  // update todo (using firebase realtime database);
  // const updateTodo = async () => {
  //   try {
  //     await db.ref(`/todos/${authContext?.user?.uid}/${id}`).update({
  //       title,
  //       isCompleted,
  //     });
  //     alert("Todo updated successfully!");
  //   } catch (error: unknown) {
  //     console.log((error as Error).message);
  //   }
  // };

  // update todo (using firebase firestore)
  const updateTodo = async () => {
    try {
      await firestoreDB
        .collection("todos")
        .doc(authContext?.user?.uid)
        .collection("items")
        .doc(id)
        .update({
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
