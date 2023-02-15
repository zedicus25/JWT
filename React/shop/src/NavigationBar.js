import {Link, Outlet} from 'react-router-dom'
import './NavigationBar.css';
import SearchBlock from './SearchBlock';

function NavigationBar(){
    return(<div>
        <SearchBlock></SearchBlock>
        <nav className="justify-center">
            <ul>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/threedpage'>3D</Link>
                </li>
                <li>
                    <Link to='/twodpage'>2D</Link>
                </li>
                <li>
                    <Link to='/addonspage'>Add-Ons</Link>
                </li>
                <li>
                    <Link to='/audiopage'>Audio</Link>
                </li>
                <li>
                    <Link to='/vfxpage'>VFX</Link>
                </li>
            </ul> 
        </nav>

        <Outlet></Outlet>
    </div>);
}
export default NavigationBar;