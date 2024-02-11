import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5001";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [forbiddenNotification, setForbiddenNotification] = useState(false);
  const [successNotification, setSuccessNotification] = useState(false);

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/event`);
      setEvents(response.data);
    } catch (error) {
      handleForbiddenError(error);
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this event?");
      if (!confirmed) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/event/${eventId}`);
      getEvents();
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
      setForbiddenNotification(true);
      setTimeout(() => {
        setForbiddenNotification(false);
      }, 3000);
    } else {
      console.error("Error:", error.message);
    }
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <div className="table-container"></div>
      <h1 className='title'>Event</h1>
      <h2 className='subtitle'>List of Event</h2>
      <Link to="/events/add" className="button is-primary mb-2">
        Add New
      </Link>
      <div className="container">
        <div className="columns is-multiline is-flex is-justify-content-center">
          {events.map((event) => (
            <div className="column is-justify-content-center is-three-quarters-mobile is-two-thirds-tablet is-half-desktop is-one-third-widescreen is-one-quarter-fullhd" key={event.uuid}>
              <div className="card">
                <div className="card-image">
                  <figure className="image is-1by1">
                    <img src={event.url} alt="Image" />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-5">{truncateText(event.title, 18)}</p>
                      <h6 className="subtitle is-6">{truncateText(event.description, 50)}</h6>
                    </div>
                  </div>
                </div>

                <footer className="card-footer">
                  <Link to={`edit/${event.uuid}`} className="card-footer-item">
                    Edit
                  </Link>
                  <a onClick={() => deleteEvent(event.uuid)} className="card-footer-item">
                    Delete
                  </a>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>

      {forbiddenNotification && (
        <div className="notification is-danger" style={{ position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }}>
          <button className="delete" onClick={() => setForbiddenNotification(false)}></button>
          You do not have permission to perform this action.
        </div>
      )}

      {successNotification && (
        <div className="notification is-success" style={{ position: 'fixed', top: '5rem', right: '1rem', zIndex: 1000 }}>
          <button className="delete" onClick={() => setSuccessNotification(false)}></button>
          Event successfully deleted.
        </div>
      )}
    </div>
  );
};

export default EventList;
