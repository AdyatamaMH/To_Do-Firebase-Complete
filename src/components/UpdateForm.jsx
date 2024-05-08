import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore'; 
import { db } from '../firebase';

const UpdateForm = ({ updateData, cancelUpdate }) => {
  const [title, setTitle] = useState(updateData ? updateData.title : '');

  const handleUpdate = async (e) => { 
    e.preventDefault();
    const taskRef = doc(db, 'tasks', updateData.id);
    try { 
      await updateDoc(taskRef, { 
        title: title
      });
    } catch (err) { 
      alert(err); 
    } 
  }

  return (
    <>
      {/* Update Task */}
      <form onSubmit={handleUpdate} className='editTodo' name='updateTodo'>
        <div className="row">
          <div className="col">
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-control form-control-lg"
            />
          </div>
          <div className="col-auto">
            <button
              type="submit"
              className="btn btn-lg btn-success mr-20"
            >Update</button>
            <button
              onClick={cancelUpdate}
              className="btn btn-lg btn-warning"
            >Cancel</button>
          </div>
        </div>
      </form>
      <br />  
    </>
  );
}

export default UpdateForm;
