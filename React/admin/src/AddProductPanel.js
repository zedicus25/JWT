import axios from "axios";
import './AddProductPanel.css'
import { useEffect, useState } from "react";
import ManagerNavBar from "./ManagerNavBar";
import Form from 'react-bootstrap/Form';
function AddProductPanel() {

const url = "http://wonof44260-001-site1.itempurl.com/api";
const [categories, setCategories] = useState([]);
const [subCategories, setSubCategories] = useState([]);
const [productName, setName] = useState('');
const [productPrice, setPrice] = useState(1);
const [productImage, setImage] = useState("");
const [productQuantity, setQuantity] = useState(0);
const [soldCount, setSoldCount] = useState(0);
const [categoryId, setCategoryId] = useState(1);
const [subCategoryId, setSubCategoryId] = useState(1);

useEffect(() => {
      axios.get(`${url}/Category/subCategoryList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function(res) {
        if(res.status == '200'){
            setSubCategories(res.data);
            res.data.map(x => subCategories.push(x));
            let parent = document.getElementById('subCategoriesDrop');
            parent.innerHTML = "";
            res.data.map(x => {
                let opt = document.createElement('option');
                opt.setAttribute('value', x.id);
                opt.innerText = x.name;
                parent.append(opt);
            });
        }
      });

      axios.get(`${url}/Category/categoryList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function(res) {
        if(res.status == '200'){
            setCategories(res.data);
            res.data.map(x => categories.push(x));
            let parent = document.getElementById('categoriesDrop');
            parent.innerHTML = "";
            res.data.map(x => {
                let opt = document.createElement('option');
                opt.setAttribute('value', x.id);
                opt.innerText = x.name;
                parent.append(opt);
            });
        }
      });

}, []);

function AddProduct(){
axios.post(`${url}/Products/addProduct`,{ 
    name: productName, price:productPrice, photo:productImage, 
    categoryId:categoryId, subCategoryId:subCategoryId, 
    quantity:productQuantity, sold:soldCount}, {
        headers:{
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token"),
            'content-type': 'text/json'
        }
    }).then(function (res) {
        if(res.status == '200'){
            alert('Added!');
        }
      }).finally(() => {
        setName("");
        setPrice(1);
        setImage("");
        setQuantity(0);
        setSoldCount(0);
        setCategoryId(1);
        setSubCategories(1);
      });
}


    return(
        <div className="flexbox-row">
            <ManagerNavBar></ManagerNavBar>
            <div style={{padding:20}}>
                <h5>Add new product</h5>
            <form>
                <div className="form-group mt-3">
                    <label>Product name</label>
                    <input value={productName} onChange={(e) => setName(e.target.value)} className="form-control mt-1" type='text' placeholder='Name'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Product price</label>
                    <input value={productPrice} onChange={(e) => setPrice(e.target.value)}  className="form-control mt-1" type='number' min='1' placeholder='Price'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Product image url</label>
                    <input value={productImage} onChange={(e) => setImage(e.target.value)}  className="form-control mt-1" type='url' placeholder='Image url'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Quantity count</label>
                    <input value={productQuantity} onChange={(e) => setQuantity(e.target.value)}  className="form-control mt-1" min='1' type='number' placeholder='Quantity'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Sold count</label>
                    <input  value={soldCount} onChange={(e) => setSoldCount(e.target.value)} className="form-control mt-1" min='1' type='number' placeholder='Sold'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Category</label>
                    <select onChange={(e) => setCategoryId(e.target.value)} className="form-select" id='categoriesDrop'>
                        <option value='' disabled=''>Select</option>
                    </select>
                </div>
                <div className="form-group mt-3">
                    <label>Sub category</label>
                    <select onChange={(e) => setSubCategoryId(e.target.value)} className="form-select" id='subCategoriesDrop'>
                        <option value='' disabled=''>Select</option>
                    </select>
                </div>
                <div className="form-group mt-3">
                    <input onClick={() => AddProduct()} type='button' className="btn btn-primary" value='Add product'></input>
                </div>
            </form>
            </div>
        </div>
    );
}
export default AddProductPanel;