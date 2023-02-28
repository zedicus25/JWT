import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import './RegistrationModal.css';
import { useState } from 'react';
import api from '../../apiAccess';

const RegistrationModal = (props) =>{

  const initialValues = { username: "", email: "", password: "" ,passwordConfirm: ""};
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [alertVisibility, setVisibility] = useState(false);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormValues({ ...formValues, [name]: value });
    };

    const validate = (values) => {
      const errors = {};
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
      if (!values.username) {
        errors.username = "Username is required!";
      }
      else if(!/^[a-zA-Z0-9]+$/.test(values.username)){
        errors.username = "Login must contains only letters and numbers!";
      }
      if (!values.email) {
        errors.email = "Email is required!";
      } else if (!regex.test(values.email)) {
        errors.email = "This is not a valid email format!";
      }
      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be more than 6 characters";
      } else if (values.password.length > 20) {
        errors.password = "Password cannot exceed more than 20 characters";
      }
      else if(!/\d/.test(values.password)){
        errors.password = "Password must contain one digit"
      }
      else if(!/[a-z]/.test(values.password)){
        errors.password = "Password must contain one lower case letter"
      }
      else  if(!/[A-Z]/.test(values.password)){
        errors.password = "Password must contain one upper case letter"
      }
      else if(!/[!@#\$%\^\&*\)\(+=._-]/.test(values.password)){
        errors.password = "Password must contain one special symbol";
      }
      if(values.password !== values.passwordConfirm)
        errors.passwordConfirm = "Passwords not equals";
      return errors;
    };


    const signUp = async(e) => {
      e.preventDefault();
      setFormErrors(validate(formValues));
      if(Object.keys(formErrors).length === 0){
        const res = await api.signUp(formValues.username, formValues.email, formValues.password);
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

    const clearInputs = () => {
      setFormErrors({});
      setFormValues(initialValues);
    }

  return(
    <Modal
    {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
      <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
          Sign Up
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>  
      <div className="Auth-form-container">
      
  <form className="Auth-form">
  <Alert style={{display: alertVisibility ? 'block' : 'none'}} variant='danger'>Some went's wrong:( Try again later and never give up!</Alert>
    <div className="Auth-form-content">
      <h3 className="Auth-form-title">Create new account</h3>
      <div className="form-group mt-3">
        <label>Email:</label>
        <input
          onChange={(e) => handleChange(e)}
          value={formValues.email}
          type="text"
          name='email'
          className="form-control mt-1"
          placeholder="Enter login"
        />
        <p className='error-text'>{formErrors.email}</p>
      </div>
      <div className="form-group mt-3">
        <label>Login:</label>
        <input
          onChange={(e) => handleChange(e)}
          value={formValues.username}
          type="text"
          name='username'
          className="form-control mt-1"
          placeholder="Enter login"
        />
        <p className='error-text'>{formErrors.username}</p>
      </div>
      <div className="form-group mt-3">
        <label>Password:</label>
        <input
          onChange={(e) => handleChange(e)}
          value={formValues.password}
          type="password"
          name='password'
          className="form-control mt-1"
          placeholder="Enter password"
        />
        <p className='error-text'>{formErrors.password}</p>
      </div>
      <div className="form-group mt-3">
        <label>Password:</label>
        <input
          onChange={(e) => handleChange(e)}
          value={formValues.passwordConfirm}
          type="password"
          name='passwordConfirm'
          className="form-control mt-1"
          placeholder="Enter password"
        />
        <p className='error-text'>{formErrors.passwordConfirm}</p>
      </div>
      <div className="d-grid gap-2 mt-3">
        <button type="button" onClick={(e) => signUp(e)} className="btn btn-primary">
          Sign Up
        </button>
      </div>
    </div>
  </form>
</div>
      </Modal.Body>
    </Modal>
  );
}

export default RegistrationModal;