import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import api from '../../apiAccess';
import './LoginModal.css';

  const LoginModal = (props) => {
    const initialValues = { login: "", password: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
    const [alertVisibility, setVisibility] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };

    const singIn = async(e) => {
      e.preventDefault();
      setFormErrors(validate(formValues));
      if(Object.keys(formErrors).length === 0){
        const res = await api.signIn(formValues.login, formValues.password);
        if(res == undefined){
          setVisibility(true);
          return;
        }
        if(res.status == '200'){
          props.onHide();
          clearInputs();
        }
      }
   
    }

    const validate = (values) => {
      const errors = {};
      if (!values.login) {
        errors.login = "Username is required!";
      }
      else if(!/^[a-zA-Z0-9]+$/.test(values.username)){
        errors.login = "Login must contains only letters and numbers!";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be more than 6 characters";
      } else if (values.password.length > 20) {
        errors.password = "Password cannot exceed more than 20 characters";
      }
      return errors;
    };


    const clearInputs = () => {
      setFormValues(initialValues);
      setFormErrors({});
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
            Sign In
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='paddingTB-50'>  
        <div className="Auth-form-container">
        
    <form className="Auth-form">
    <Alert style={{display:alertVisibility ? 'block' : 'none'}} variant='danger'>Incorrect login or password!</Alert>
      <div className="Auth-form-content">
        <h3 className="Auth-form-title">Sign In</h3>
        <div className="form-group mt-3">
          <label>Login</label>
          <input
            onChange={(e) => handleChange(e)}
            value={formValues.login}
            type="text"
            name='login'
            className="form-control mt-1"
            placeholder="Enter login"
          />
          <p>{formErrors.login}</p>
        </div>
        <div className="form-group mt-3">
          <label>Password</label>
          <input
            onChange={(e) => handleChange(e)}
            value={formValues.password}
            type="password"
            name='password'
            className="form-control mt-1"
            placeholder="Enter password"
          />
          <p>{formErrors.password}</p>
        </div>
        <div className="d-grid gap-2 mt-3">
          <button type="button" onClick={(e) => singIn(e)} className="btn btn-primary">
            Sign In
          </button>
        </div>
      </div>
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