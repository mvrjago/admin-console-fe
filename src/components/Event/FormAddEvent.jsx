import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001";

const FormAddEvent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [preview, setPreview] = useState("");
  const [forbiddenNotification, setForbiddenNotification] = useState(false);
  const navigate = useNavigate();

  const loadImage = (e) => {
    const image = e.target.files[0];
    setFile(image);
    setPreview(URL.createObjectURL(image));
  };

  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    try {
      await axios.post(`${API_BASE_URL}/event`, formData, {
        headers: {
          "Content-type": "multipart/form-data",
        },
      });
      navigate("/events");
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setForbiddenNotification(true);
        setTimeout(() => {
          setForbiddenNotification(false);
        }, 3000);
      } else {
        console.log(error);
      }
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

        <form onSubmit={saveProduct}>
          <div className="field">
            <div style={{ marginLeft: '70px' }}>
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
                  className="textarea has-fixed-size"
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="field">
            <div style={{ marginLeft: '70px' }}>
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
                      <span className="file-label" >Choose a file...</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {preview ? (
            <figure className="image is-128x128" style={{ marginLeft: '70px' }}>
              <img src={preview} alt="Preview Image" />
            </figure>
          ) : (
            ""
          )}

          <div className="field">
            <div className="control" style={{ marginLeft: '70px' }}>
              <button type="submit" className="button is-success">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormAddEvent;
