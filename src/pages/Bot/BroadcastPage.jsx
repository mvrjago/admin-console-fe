import React, { useEffect } from "react";
import Layout from "../Layout/Layout";
import Broadcast from "../../components/Bot/Broadcast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import '../../styles/Fully.css'

const BroadcastPage = () => {
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
      <Broadcast/>
    </Layout>
  );
};

export default BroadcastPage;