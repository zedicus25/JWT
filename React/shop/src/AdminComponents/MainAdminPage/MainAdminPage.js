import { useEffect } from "react";
import {  useNavigate } from "react-router-dom";
import token from '../../jwtToken';

const MainAdminPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const managerInfo = token.getUserData();
    if(managerInfo.Admin === false)
      navigate('/');
  });
    return(
      <div>Admin Page</div>
    );
  }
  export default MainAdminPage;