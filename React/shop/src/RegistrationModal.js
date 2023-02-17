import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import './RegistrationModal.css';
import { useState } from 'react';
import axios from 'axios';

function RegistrationModal(props) {

    const [pass, SetPass] = useState("");
    const [passAgain, SetPassAgain] = useState("");
    const [email, SetEmail] = useState("");
    const [login, SetLogin] = useState("");
    function reg() { 
        if(email.includes('@') && email.includes('.')){
            if(/^[A-Za-z0-9!@]*$/.test(pass) && /^[A-Za-z0-9!@]*$/.test(passAgain) && pass !== "" && pass === passAgain)
            {
                axios.post('http://wonof44260-001-site1.itempurl.com/api/Authentication/regUser', {
                    Email: email,
                    Password: pass,
                    UserName: login
                }).then(function (res) {
                    if(res.status == '200'){
                        props.onHide();
                    }
                }).catch(function (error) {
                    alert("Something went wrong");
                })
            }
            else
                alert('Passwords not equals');
        }
        else
            alert('Email not valid');
    }


    return(
        <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Registration new account
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='paddingTB-50'>
      <div className='justify-center-form'>
        <form className='flexBox-form'>
            <label>Enter login:</label>
            <input onChange={(e) => SetLogin(e.target.value)} className='input-form' type='text' placeholder='Login' value={login}></input>
            <label>Enter email:</label>
            <input onChange={(e) => SetEmail(e.target.value)} className='input-form' type='email' placeholder='Email' value={email}></input>
            <label>Enter password:</label>
            <input onChange={(e) => SetPass(e.target.value)}  className='input-form' minLength='5' maxLength='15' type='password' placeholder='Password' value={pass}></input>
            <label>Enter password again:</label>
            <input  onChange={(e) => SetPassAgain(e.target.value)}  className='input-form' minLength='5' maxLength='15' type='password' placeholder='Password Again' value={passAgain}></input>
            <input  className='input-form' onClick={() => reg()} type='button' value='Enter'></input>
        </form>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    );
}

export default RegistrationModal;