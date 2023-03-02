import { useState } from "react";
import { Link } from "react-router-dom";
import './ManagerNavBar.css';

function ManagerNavBar(){

    const [prodControls, setProdControls] = useState(false);
    const [catControls, setCatControls] = useState(false);
    const [subCatControls, setSubCatControls] = useState(false);

    return(
        <div style={{padding:20, backgroundColor:"wheat"}}>
            <ul className="dashboard">
                <li onClick={() => setProdControls(!prodControls)}>
                    <div>
                        <h5>Products</h5>
                        <div style={{display:prodControls? 'block' : 'none'}}>
                            <ul className="drop-menu">
                                <li><Link to='/manager/addproductpanel'>Add products</Link></li>
                                <li><Link to='/manager/updateproductpanel'>Update products</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li onClick={() => setCatControls(!catControls)}>
                    <div>
                        <h5>Categories</h5>
                        <div style={{display:catControls? 'block' : 'none'}}>
                            <ul className="drop-menu">
                                <li><Link to='/manager/addproductpanel'>Add categories</Link></li>
                                <li><Link to='/manager/updateproductpanel'>Update categories</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
                <li onClick={() => setSubCatControls(!subCatControls)}>
                    <div>
                        <h5>Sub Categories</h5>
                        <div style={{display:subCatControls? 'block' : 'none'}}>
                            <ul className="drop-menu">
                                <li><Link to='/manager/addproductpanel'>Add sub-categories</Link></li>
                                <li><Link to='/manager/updateproductpanel'>Update sub-categories</Link></li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    );
}

export default ManagerNavBar;