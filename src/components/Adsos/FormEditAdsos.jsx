import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5001";

const FormEditAdsos = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    getAdsosById();
  }, [id]);

  const getAdsosById = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/adsos/${id}`);
      setName(response.data.name);
      setTitle(response.data.title);
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
        setShowNotification(true);
      }
    }
  };

  const updateAdsos = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/adsos/${id}`, {
        name: name,
        title: title
      });
      navigate("/adsos");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setMsg("You do not have permission to update this content.");
      } else if (error.response) {
        setMsg(error.response.data.msg);
      }
      setShowNotification(true);
    }
  };

  return (
    <div className="columns ml-3 mt-5">
      <div className="column is-half">
        <form onSubmit={updateAdsos}>
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
                Update
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

export default FormEditAdsos;
