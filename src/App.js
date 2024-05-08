import React, { useState, useEffect } from 'react';
import { onSnapshot, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth } from './firebase.js';
import { Timestamp } from 'firebase/firestore';
import { db } from './firebase.js';
import AddTaskForm from './components/AddTaskForm.jsx';
import UpdateForm from './components/UpdateForm.jsx';
import ToDo from './components/ToDo.jsx';
import FullName from './components/FullName.jsx';
import TaskFilter from './components/TaskFilter.jsx';
import SignIn from './components/auth/login';
import SignUp from "./components/auth/register";
import AuthDetails from "./components/auth/authdetails";
import UserProfile from './components/UserProfile';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [toDo, setToDo] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [updateData, setUpdateData] = useState(null);
  const [fullName, setFullName] = useState('Adyatama Mahabarata');
  const [number, setNumber] = useState('2602158626');
  const [filter, setFilter] = useState('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'tasks'), (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setToDo(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    try {
      await addDoc(collection(db, 'tasks'), {
        title: newTask,
        description: '',
        completed: false,
        created: Timestamp.now()
      });
      setNewTask('');
    } catch (err) {
      alert(err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      alert(err);
    }
  };

  const markDone = async (id, status) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        completed: !status
      });
    } catch (err) {
      alert(err);
    }
  };

  const cancelUpdate = () => {
    setUpdateData(null);
  };

  const changeTask = (e) => {
    const updatedData = { ...updateData, title: e.target.value };
    setUpdateData(updatedData);
  };

  const updateTask = async () => {
    try {
      const taskRef = doc(db, 'tasks', updateData.id);
      await updateDoc(taskRef, {
        title: updateData.title
      });
      setUpdateData(null);
    } catch (err) {
      alert(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
  };

  const handleProfile = () => {
    window.location.href = '/profile';
  };

  return (
    <div className="container App">
      <br />
      <br />
      <h2>To Do List</h2>
      <br />
      <br />

      {isAuthenticated ? (
        <>
          <FullName fullName={fullName} number={number} />
          {updateData ? (
            <UpdateForm
              updateData={updateData}
              changeTask={changeTask}
              updateTask={updateTask}
              cancelUpdate={cancelUpdate}
            />
          ) : (
            <AddTaskForm newTask={newTask} setNewTask={setNewTask} addTask={addTask} />
          )}

          <TaskFilter filter={filter} setFilter={setFilter} />

          {toDo && toDo.length ? (
            <ToDo tasks={toDo} filter={filter} markDone={markDone} setUpdateData={setUpdateData} deleteTask={deleteTask} />
          ) : (
            'No Tasks...'
          )}
        </>
      ) : (
        <>
          <SignIn setIsAuthenticated={setIsAuthenticated} />
          <SignUp />
          <AuthDetails />
        </>
      )}

      {/* User Profile Component */}
      {window.location.pathname === '/profile' && <UserProfile currentUser={currentUser} />}
      
      {currentUser && (
        <div>
          <h2>User Profile</h2>
          <p>Logged in as: {currentUser.email}</p>
          <p>UID: {currentUser.uid}</p>
          <p>Date Created: {new Date(currentUser.metadata.creationTime).toLocaleString()}</p>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

    </div>
  );
}

export default App;
