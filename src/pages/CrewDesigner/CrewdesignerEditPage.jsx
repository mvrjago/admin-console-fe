import React, {useEffect} from 'react'
import Layout from '../Layout/Layout'
import FormEditCrewdesigner from '../../components/CrewDesigner/FormEditCrewdesigner'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";

const EditCrewdesigner = () => {
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
        <FormEditCrewdesigner />
    </Layout>
  )
}

export default EditCrewdesigner