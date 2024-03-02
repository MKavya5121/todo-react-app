import React, { useState, useEffect, useRef } from "react";
import "./ToDoApp.css";

const TodoApp = () => {
  const [input, setInput] = useState("");
  const [items, setItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("todoItems")) || [];
    console.log("Loaded from local storage:", storedItems);
    setItems(storedItems);
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    console.log("Saving to local storage:", items);
    localStorage.setItem("todoItems", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (editingIndex !== null) {
      inputRef.current.focus();
    }
  }, [editingIndex]);

  const handleChange = (event) => {
    setInput(event.target.value);
  };

  const storeItems = (event) => {
    if (event) {
      event.preventDefault();
    }
    if (!input.trim()) return;
    if (editingIndex !== null) {
      const editedItem = [...items];
      editedItem[editingIndex] = { text: input, completed: false };
      setItems(editedItem);
      setEditingIndex(null);
    } else {
      setItems([...items, { text: input, completed: false }]);
    }
    setInput("");
  };

  const deleteItem = (key) => {
    setItems(items.filter((data, index) => index !== key));
  };

  const completeItem = (index) => {
    const updatedItems = items.map((item, id) => {
      if (id === index) {
        return { ...item, completed: !item.completed };
      }
      return item;
    });
    setItems(updatedItems);
  };

  const editItem = (index) => {
    setInput(items[index].text);
    setEditingIndex(index);
  };

  const deleteAllItems = () => {
    setItems([]);
    inputRef.current.focus();
  };
  return (
    <div className="todo-container">
      <form className="input-section" onSubmit={storeItems}>
        <h1>Todo App</h1>
        <input
          type="text"
          ref={inputRef}
          value={input}
          onChange={handleChange}
          placeholder="Enter Items..."
        />
        {editingIndex == null ? (
          <i
            className="fa-solid fa-plus"
            title="Add item"
            onClick={storeItems}
          ></i>
        ) : (
          <i
            className="fa-solid fa-check"
            title="Update item"
            onClick={storeItems}
          ></i>
        )}
      </form>
      <ul className="list-container">
        {items.length === 0 ? (
          <li>
            <span className="task-message">No todos yet. Add some items!</span>
          </li>
        ) : (
          items.map((item, index) => (
            <li key={index} className="task-item">
              <span className={item && item.completed ? "completed" : ""}>
                {item && item.text}
              </span>
              <i
                className="fa-solid fa-check-double  button-transition"
                title="Complete task"
                onClick={() => completeItem(index)}
              ></i>
              <i
                className="fa-solid fa-pen-to-square  button-transition"
                title="Edit task"
                onClick={() => editItem(index)}
              ></i>

              <i
                className="fa-solid fa-trash"
                title="Delete task"
                onClick={() => deleteItem(index)}
              ></i>
            </li>
          ))
        )}
      </ul>
      {items.length > 0 && (
        <button className="delete-all-button" onClick={deleteAllItems}>
          Delete All
        </button>
      )}
    </div>
  );
};

export default TodoApp;
