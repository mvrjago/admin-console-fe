import React, {useEffect} from 'react';
import Layout from '../Layout/Layout';
import FormAddEvent from '../../components/Event/FormAddEvent';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const AddEvent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <Layout>
        <FormAddEvent />
    </Layout>
  )
}

export default AddEvent