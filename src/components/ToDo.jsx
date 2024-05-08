import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { collection, addDoc, Timestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const ToDo = ({ tasks, filter, markDone, setUpdateData, deleteTask }) => {
  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return false;
  });

  const handleAddTask = async () => {
    try {
      await addDoc(collection(db, 'tasks'), {
        title: '',
        description: '',
        completed: false,
        created: Timestamp.now()
      });
    } catch (err) {
      alert(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, 'tasks', id));
    } catch (err) {
      alert(err);
    }
  };

  const handleUpdateTaskStatus = async (id, status) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        completed: !status
      });
    } catch (err) {
      alert(err);
    }
  };

  return (
    <>
      <form onSubmit={handleAddTask} className='addTodo' name='addTodo'>
      </form>
      {filteredTasks.map((task, index) => (
        <div className="col taskBg" key={task.id}>
          <div className={task.completed ? 'done' : ''}>
            <span className="taskNumber">{index + 1}</span>
            <span className="taskText">{task.title}</span>
          </div>
          <div className="iconsWrap">
            <span
              title="Completed / Not Completed"
              onClick={() => handleUpdateTaskStatus(task.id, task.completed)}
            >
              <FontAwesomeIcon icon={faCircleCheck} />
            </span>
            {!task.completed && (
              <span
                title="Edit"
                onClick={() =>
                  setUpdateData({
                    id: task.id,
                    title: task.title,
                    completed: task.completed ? true : false,
                  })
                }
              >
                <FontAwesomeIcon icon={faPen} />
              </span>
            )}
            <span title="Delete" onClick={() => handleDeleteTask(task.id)}>
              <FontAwesomeIcon icon={faTrashCan} />
            </span>
          </div>
        </div>
      ))}
    </>
  );
};

export default ToDo;
