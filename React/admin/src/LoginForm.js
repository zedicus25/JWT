import './LoginForm.css';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


function LoginForm() {
    const navigate = useNavigate();
const [pass, SetPass] = useState("");
const [login, SetLogin] = useState("");
function enter() { 
    if(login !== ""){
        if(/^[A-Za-z0-9!@]*$/.test(login) && /^[A-Za-z0-9!@]*$/.test(login) && pass !== "")
        {
            axios.post('http://wonof44260-001-site1.itempurl.com/api/Authentication/login', {
                Password: pass,
                UserName: login
            }).then(function (res) {
                if(res.status == '200'){
                    sessionStorage.setItem('token', res.data.token);
                    if(res.data.roles.includes('Admin'))
                        navigate('/adminmainpage'); 
                    else if(res.data.roles.includes('Manager')){
                        navigate('/managermainpage');
                    }
                }
                
            }).catch(function (error) {
                console.log(error);
            })
        }
        else
            alert('Passwords not equals');
    }
    else
        alert('Email not valid');
}


  return (
    <div className="Auth-form-container">
    <form className="Auth-form">
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">Sign In</h3>
        <div className="form-group mt-3">
          <label>Login</label>
          <input
           onChange={(e) => SetLogin(e.target.value)}
           value={login}
            type="text"
            className="form-control mt-1"
            placeholder="Enter login"
          />
        </div>
        <div className="form-group mt-3">
          <label>Password</label>
          <input
            onChange={(e) => SetPass(e.target.value)}
            value={pass}
            type="password"
            className="form-control mt-1"
            placeholder="Enter password"
          />
        </div>
        <div className="d-grid gap-2 mt-3">
          <button type="button" onClick={() => enter()} className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </form>
  </div>
  );
}

export default LoginForm;
