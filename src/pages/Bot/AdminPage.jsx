import React, { useEffect } from "react";
import Layout from "../Layout/Layout";
import Token from "../../components/Bot/token";
import Avatar from "../../components/Bot/Avatar";
import Goodbye from "../../components/Bot/Goodbye";
import DeleteMessage from "../../components/Bot/DeleteMessage";
import WelcomeMessage from "../../components/Bot/WelcomeMessage";
import RoleLog from "../../components/Bot/RoleLog";
import ModeratorLog from "../../components/Bot/ModeratorLog";
import ControlPanel from "../../components/Bot/ControlPanel";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../../features/authSlice";
import "../../styles/Fully.css";

const AdminPage = () => {
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
      <Token />
      <div className="bot-layout">
        <Avatar />
        <WelcomeMessage />
        <Goodbye />
        <DeleteMessage />
        <RoleLog />
        <ModeratorLog />
        <ControlPanel />
      </div>
    </Layout>
  );
};

export default AdminPage;
