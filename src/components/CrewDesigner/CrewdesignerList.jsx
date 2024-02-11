import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import '../../styles/Table.css';

const API_BASE_URL = "http://localhost:5001";

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const CrewDesignerList = () => {
  const [crewdesigner, setCrewDesigner] = useState([]);
  const [forbiddenNotification, setForbiddenNotification] = useState(false);
  const [successNotification, setSuccessNotification] = useState(false);

  useEffect(() => {
    getCrewDesigner();
  }, []);

  const getCrewDesigner = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/crewdesigner`);
      setCrewDesigner(response.data);
    } catch (error) {
      console.error("Error fetching crewdesigner:", error.message);
    }
  };

  const deleteCrewDesigner = async (crewdesignerId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this content?");
      
      if (!confirmed) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/crewdesigner/${crewdesignerId}`);
      getCrewDesigner();
      setSuccessNotification(true);
      setTimeout(() => {
        setSuccessNotification(false);
      }, 3000);
    } catch (error) {
      handleForbiddenError(error);
    }
  };

  const handleForbiddenError = (error) => {
    if (error.response && error.response.status === 403) {
      console.error("You are not authorized to perform this action.");
      setForbiddenNotification(true);
      setTimeout(() => {
        setForbiddenNotification(false);
      }, 3000);
    } else {
      console.error("Error:", error.message);
    }
  };

  return (
    <div>
      <div className="table-container"></div>
      <h1 className='title'>Content</h1>
      <h2 className='subtitle'>List of Content</h2>
      <Link to="/crewdesigner/add" className='button is-primary mb-2 mr-2'>Add New</Link>
      <Link to="/crewdesigner/history" className='button is-info mb-2'>History</Link>
      <div className="table-container">
        <div className="table-wrapper">
          <table className='table is-striped is-fullwidth is-bordered is-hoverable'>
            <thead>
              <tr>
                <th>Content Name</th>
                <th>Description</th>
                <th>Created By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {crewdesigner.map((crewdesigner, index) => (
                crewdesigner.status !== 'done' && (
                  <tr key={crewdesigner.uuid}>
                    <td data-label="Content Name">{truncateText(crewdesigner.name, 25)}</td>
                    <td data-label="Description">{truncateText(crewdesigner.title, 25)}</td>
                    <td data-label="Created By">{crewdesigner.user ? truncateText(crewdesigner.user.name, 25) : 'Deleted User'}</td>
                    <td data-label="Status">{truncateText(crewdesigner.status, 25)}</td>
                    <td data-label="Actions">
                      <Link to={`/crewdesigner/edit/${crewdesigner.uuid}`} className='button is-small is-info mr-2'>Edit</Link>
                      <Link to={`/crewdesigner/detail/${crewdesigner.uuid}`} className='button is-small is-warning mr-2'>Detail</Link>
                      <button
                        className='button is-small is-danger'
                        onClick={() => deleteCrewDesigner(crewdesigner.uuid)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {forbiddenNotification && (
        <div className="notification is-danger" style={{ position: 'absolute', top: '5rem', right: '1rem' }}>
          <button className="delete" onClick={() => setForbiddenNotification(false)}></button>
          You are not authorized to perform this action.
        </div>
      )}
      {successNotification && (
        <div className="notification is-success" style={{ position: 'absolute', top: '5rem', right: '1rem' }}>
          <button className="delete" onClick={() => setSuccessNotification(false)}></button>
          Content successfully deleted.
        </div>
      )}
    </div>
  );
};

export default CrewDesignerList;
