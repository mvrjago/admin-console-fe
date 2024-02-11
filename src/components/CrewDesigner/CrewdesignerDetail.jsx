import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const API_BASE_URL = "http://localhost:5001";

const CrewdesignerDetail = () => {
  const [crewdesigner, setEvent] = useState({});
  const [status, setStatus] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const getCrewdesignerById = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crewdesigner/${id}`);
      setEvent(response.data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  }, [id]);

  useEffect(() => {
    getCrewdesignerById();
  }, [id, getCrewdesignerById]);

  const updateDetailCrewdesigner = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_BASE_URL}/crewdesigner/detail/${id}`, {
        status: status,
        url: url
      });
      navigate("/crewdesigner");
    } catch (error) {
      if (error.response) {
      }
    }
  };

  return (
    <section className='hero is-halfheight is-dark'>
      <div className="hero-body is-flex" style={{ alignItems: 'flex-start'}}>
        <form onSubmit={updateDetailCrewdesigner}>
          <div>
            <p className='title is-spaced'>{crewdesigner.name}</p>
            <p className='subtitle'>{crewdesigner.title}</p>
            <label className="label">Name</label>
            <div className="control is-white">
              <input
                type="textarea"
                className="input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Canva/Discord URL"
              />
            </div>
            <label className="label">Role</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="---">---</option>
                  <option value="pending">pending</option>
                  <option value="done">done</option>
                </select>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button type="submit" className="button is-success mt-5">
                  Save
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CrewdesignerDetail;
