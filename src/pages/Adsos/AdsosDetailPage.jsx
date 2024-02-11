import React, {useEffect} from 'react'
import Layout from '../Layout/Layout'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import AdsosDetail from '../../components/Adsos/AdsosDetail';

const EditAdsos = () => {
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
        <AdsosDetail />
    </Layout>
  )
}

export default EditAdsos