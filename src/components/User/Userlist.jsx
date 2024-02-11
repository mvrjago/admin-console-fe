import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5001';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    getUsers();
  }, [isDeleted]);

  const getUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    setUsers(response.data);
  };

  const deleteUser = async (userId) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (confirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/users/${userId}`);
        setIsDeleted(true);
      } catch (error) {
        console.error('Error deleting user:', error.message);
      }
    }
  };

  return (
    <div>
      <div className="table-container">
        <h1 className="title">Users</h1>
        <h2 className="subtitle">List of Users</h2>
        <Link to="/users/add" className="button is-primary mb-2">
          Add New
        </Link>

        {isDeleted && (
          <div className="notification is-success" style={{ position: 'absolute', top: '5rem', right: '1rem' }}>
            <button className="delete" onClick={() => setIsDeleted(false)}></button>
            User deleted successfully.
          </div>
        )}

        <div className="table-container">
          <table className="table is-striped is-fullwidth is-bordered is-hoverable">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.uuid}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Name">{user.name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td data-label="Role">{user.role}</td>
                  <td>
                    <Link
                      to={`/users/edit/${user.uuid}`}
                      className="button is-small is-info"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteUser(user.uuid)}
                      className="button is-small is-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserList;
