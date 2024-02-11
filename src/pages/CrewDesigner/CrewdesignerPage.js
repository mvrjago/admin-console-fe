import React, {useEffect} from 'react'
import Layout from '../Layout/Layout'
import CrewdesignerList from '../../components/CrewDesigner/CrewdesignerList'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";


const Crewdesigner = () => {
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
        <CrewdesignerList />
    </Layout>
  )
}

export default Crewdesigner