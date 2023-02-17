import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { createElement, useState } from 'react';
import axios from 'axios';
import './LoginModal.css';
function LoginModal(props) {

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
                        props.onHide();
                    }
                    
                }).catch(function (error) {
                        alert("Incorret login or password")
                });
            }
            else
                alert('Passwords not equals');
        }
        else
            alert('Email not valid');
    }

    return (
      <Modal
      {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Logining to account
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='paddingTB-50'>  
        <div className='justify-center-form '>
        <form className='flexBox-form'>
            <label>Enter login:</label>
            <input onChange={(e) => SetLogin(e.target.value)} className='input-form' type='email' placeholder='Email' value={login}></input>
            <label>Enter password:</label>
            <input onChange={(e) => SetPass(e.target.value)}  className='input-form' minLength='5' maxLength='15' type='password' placeholder='Password' value={pass}></input>
            <input  className='input-form' onClick={() => enter()} type='button' value='Enter'></input>
        </form>
        </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  export default LoginModal;