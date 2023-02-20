import { Navigate } from "react-router-dom";
import ManagerNavBar from "./ManagerNavBar";
function ManagerMainPage() {

    if(sessionStorage.getItem('token') == null){
        console.log("Not")
        return <Navigate replace to="/"></Navigate>
    }
    else{
       return(
        <div className="flexbox-row">
            <ManagerNavBar></ManagerNavBar>
        </div>
       );
    }
};

export default ManagerMainPage;