import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5001";

const FormEditEvent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState('');
  const [preview, setPreview] = useState('');
  const [forbiddenNotification, setForbiddenNotification] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEventById();
  }, [id]);

  const getEventById = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event/${id}`);
      setTitle(response.data.title);
      setDescription(response.data.description);
      setFile(response.data.poster);
      setPreview(response.data.url);
    } catch (error) {
      handleForbiddenError(error);
    }
  };

  const loadImage = (e) => {
    const poster = e.target.files[0];
    setFile(poster);
    setPreview(URL.createObjectURL(poster));
  };

  const updateEvent = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    try {
      await axios.patch(`${API_BASE_URL}/event/${id}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data',
        },
      });
      navigate('/events');
    } catch (error) {
      handleForbiddenError(error);
      console.error(error);
    }
  };

  const handleForbiddenError = (error) => {
    if (error.response && error.response.status === 403) {
      setForbiddenNotification(true);
      setTimeout(() => {
        setForbiddenNotification(false);
      }, 3000);
    }
  };

  return (
    <div className="columns ml-3 mt-5">
      <div className="column is-half">
        {forbiddenNotification && (
          <div className="notification is-danger" style={{ position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }}>
            You do not have permission to perform this action.
          </div>
        )}

        <form onSubmit={updateEvent}>
          <div className="field">
            <label className="label">EVENTS</label>
            <div className="control">
              <input
                type="text"
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />
            </div>
            <div className="control">
              <textarea
                className="textarea"
                rows={20}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
              ></textarea>
            </div>
          </div>

          <div className="field">
            <label className="label">Image</label>
            <div className="control">
              <div className="file">
                <label className="file-label">
                  <input
                    type="file"
                    className="file-input"
                    onChange={loadImage}
                  />
                  <span className="file-cta">
                    <span className="file-label">Choose a file...</span>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128">
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ''
          )}

          <div className="field">
            <div className="control">
              <button type="submit" className="button is-success">
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormEditEvent;
