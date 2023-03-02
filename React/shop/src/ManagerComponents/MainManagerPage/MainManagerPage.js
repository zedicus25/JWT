import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import token from '../../jwtToken';
import ManagerNavBar from "../ManagerNavBar/ManagerNavBar";
import './MainManagerPage.css';

const MainManagerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const managerInfo = token.getUserData();
    if(managerInfo.Manager === false)
      navigate('/');
  });
    return(
      <div className="flexbox-row">
        <ManagerNavBar></ManagerNavBar>
      </div>
    );
  }
  export default MainManagerPage;