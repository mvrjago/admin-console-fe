import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from "../../features/authSlice";
import logo from '../../images/plasticque-logo.png';
import '../../styles/Login.css';

const Notification = ({ type, message, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className={`notification ${type}`}>
      {message}
    </div>
  );
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isSuccess, dispatch, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    dispatch(LoginUser({ email, password }));
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  useEffect(() => {
    setShowNotification(isError || isSuccess);
  }, [isError, isSuccess]);

  return (
    <section className="hero is-fullheight is-fullwidth is-tablet backgroundweb">
      <div className="hero-body">
        <div className="container fucku" style={{marginLeft:'0'}}>
        <div className="field has-text-left">
        <figure className="image">
          <img src={logo} alt="Logo" style={{ width: '31.25rem', height: '31.25rem' }} />
        </figure>
        </div>
        </div>
      
        <div className="container">
          <div className="column is-4 is-offset-4">
            <form onSubmit={Auth}>
              {showNotification && (
                <Notification
                  type={isError ? 'is-danger' : 'is-success'}
                  message="Email/Password Salah."
                  onClose={closeNotification}
                />
              )}
              <p className='has-text-weight-bold' style={{ marginBottom: '50px', textAlign: 'center', fontSize: '40px' }}>
                USER LOGIN
              </p>
              <div className='field'>
                <div className='control'>
                  <input type='text' className='input is-medium' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email' style={{ backgroundColor: 'rgba(215, 215, 215, 0.5)' }} />
                </div>
              </div>
              <div className='field'>
                <div className='control'>
                  <input type='password' className='input is-medium' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' style={{ backgroundColor: 'rgba(215, 215, 215, 0.5)' }} />
                </div>
              </div>
              <div className='field mt-6'>
                <div className="field has-text-centered" style={{ marginBottom: '40px' }}>
                  <button
                    type="submit"
                    className="button is-medium is-black is-rounded "
                  >
                    {isLoading ? "Loading..." : "Sign In"}
                  </button>
                </div>
                <p className='has-text-centered has-text-weight-light is-family-code has-text-black'>Admin Console V.1.0</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;