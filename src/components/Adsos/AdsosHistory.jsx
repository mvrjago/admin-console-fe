import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Table.css';

const API_BASE_URL = "http://localhost:5001";

const truncateText = (text, maxLength) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

const AdsosHistory = () => {
  const [adsos, setAdsos] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  useEffect(() => {
    getAdsos();
  }, []);

  const getAdsos = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/adsos`);
      setAdsos(response.data);
    } catch (error) {
      console.error("Error fetching adsos:", error.message);
    }
  };

  const deleteAdsos = async (adsosId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this content?");
      
      if (!confirmed) {
        return;
      }

      await axios.delete(`${API_BASE_URL}/adsos/${adsosId}`);
      getAdsos();
      showNotification('Content deleted successfully!', 'is-success');
    } catch (error) {
      handleNotificationError(error);
    }
  };

  const handleNotificationError = (error) => {
    if (error.response && error.response.status === 403) {
      showNotification('You do not have permission to perform this action.', 'is-danger');
    } else {
      console.error("Error:", error.message);
    }
  };

  const copyUrlToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      showNotification('URL copied to clipboard!', 'is-success');
    }).catch((error) => {
      console.error('Error copying URL to clipboard:', error);
    });
  };

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  return (
    <div>
      <div className="table-container"></div>
      <h1 className='title'>History</h1>
      <div className="table-container">
        <div className="table-wrapper">
          <table className='table is-striped is-fullwidth is-bordered is-hoverable'>
            <thead>
              <tr>
                <th>No</th>
                <th>Content Name</th>
                <th>URL</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {adsos.map((adsos, index) => (
                adsos.status !== 'pending' && (
                  <tr key={adsos.uuid}>
                    <td data-label="No">{index + 1}</td>
                    <td data-label="Content Name">{truncateText(adsos.name, 25)}</td>
                    <td data-label="URL">{truncateText(adsos.url, 25)}</td>
                    <td data-label="Status">{truncateText(adsos.status, 25)}</td>
                    <td data-label="Actions">
                      <button
                        className='button is-small is-danger'
                        onClick={() => deleteAdsos(adsos.uuid)}
                      >
                        Delete
                      </button>
                      <button
                        className='button is-small is-info ml-2'
                        onClick={() => copyUrlToClipboard(adsos.url)}
                      >
                        Copy URL
                      </button>
                    </td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {notification.show && (
        <div className={`notification ${notification.type}`} style={{ position: 'absolute', top: '5rem', right: '1rem' }}>
          <button className="delete" onClick={() => setNotification({ show: false, message: '', type: '' })}></button>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default AdsosHistory;
