import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5001";

const FormAddAdsos = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const saveAdsos = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/adsos`, {
        name: name,
        title: title
      });
      navigate("/adsos");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setMsg("You do not have permission to create this content.");
      } else if (error.response) {
        setMsg(error.response.data.msg);
      }
      setShowNotification(true);
    }
  };

  return (
    <div className="columns ml-3 mt-5">
      <div className="column is-half">
        <form onSubmit={saveAdsos}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                type="textarea"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="control">
              <textarea
                className="textarea"
                rows={20}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Description"
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Save
              </button>
            </div>
          </div>
        </form>
        {showNotification && (
          <div className="notification is-danger" style={{ position: 'absolute', top: '5rem', right: '1rem' }}>
            {msg}
            <button className="delete" onClick={() => setShowNotification(false)}></button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormAddAdsos;
