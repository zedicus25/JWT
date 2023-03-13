import { Navigate } from "react-router-dom";
function AdminrMainPage() {

    if(sessionStorage.getItem('token') == null){
        console.log("Not")
        return <Navigate replace to="/"></Navigate>
    }
    else{
       return(
        <div>
        <p>Admin page</p>
        </div>
       );
    }
};

export default AdminrMainPage;