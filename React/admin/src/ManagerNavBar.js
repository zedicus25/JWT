import { Link } from "react-router-dom";

function ManagerNavBar(){

    return(
        <div style={{padding:20}}>
            <ul>
                <li><Link replace  to='/addproductpanel'>Add product</Link></li>
                <li><Link replace  to='/updateproductpanel'>update product</Link></li>
            </ul>
        </div>
    );
}

export default ManagerNavBar;