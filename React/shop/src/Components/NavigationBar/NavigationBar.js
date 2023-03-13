import {Link, Outlet} from 'react-router-dom'
import './NavigationBar.css';
import SearchBlock from '../SearchBlock/SearchBlock';
import Button from 'react-bootstrap/Button';

import { useState } from 'react';
import LoginModal from '../LoginModal/LoginModal';
import RegistrationModal from '../RegistrationModal/RegistrationModal';





function NavigationBar(props){
    const [loginModalShow, setLoginModalShow] = useState(false);
    const [regModalShow, setRegModalShow] = useState(false);

    return(<div>
        <SearchBlock></SearchBlock>
        <nav className="justify-center">
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link onClick={props.threeDClick}  to='/threedpage'>3D</Link>
                </li>
                <li >
                    <Link onClick={props.twoDClick} to='/twodpage'>2D</Link>
                </li>
                <li>
                    <Link onClick={props.addOnsClick} to='/addonspage'>Add-Ons</Link>
                </li>
                <li>
                    <Link onClick={props.audioClick} to='/audiopage'>Audio</Link>
                </li>
                <li>
                    <Link onClick={props.vfxClick} to='/vfxpage'>VFX</Link>
                </li>
            </ul> 
            
        </nav>
        <div className='controls-btn'>
            <Button className='margin-right-5' onClick={() => setLoginModalShow(true)} variant="outline-primary">Login</Button>
            <Button  variant="outline-primary" onClick={() => setRegModalShow(true)} >Registration</Button>
        </div>
        <LoginModal show={loginModalShow} onHide={() => setLoginModalShow(false)} />
        <RegistrationModal show={regModalShow} onHide={() => setRegModalShow(false)}></RegistrationModal>
    
        <Outlet></Outlet>
    </div>);
}
export default NavigationBar;