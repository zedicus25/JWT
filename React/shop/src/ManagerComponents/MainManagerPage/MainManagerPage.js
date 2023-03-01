import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import token from '../../jwtToken';

const MainManagerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const managerInfo = token.getUserData();
    if(managerInfo.Manager === false)
      navigate('/');
  });
    return(
      <div>Manager Page</div>
    );
  }
  export default MainManagerPage;