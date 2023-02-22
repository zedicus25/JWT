import { useEffect, useState } from "react";
import ManagerNavBar from "./ManagerNavBar";
import axios from "axios";
import { ProducsTabel } from "./ProductsTabel";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function UpdateProductPanel() {
const url = "http://wonof44260-001-site1.itempurl.com/api";
const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [subCategories, setSubCategories] = useState([]);
const [searchValue, setSearchValue] = useState('');
useEffect(() =>{
    if(subCategories.length <= 0)
    axios.get(`${url}/Category/subCategoryList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function(res) {
        if(res.status == '200'){
            setSubCategories(res.data);
            res.data.map(x => subCategories.push(x));
        }
      });
      if(categories.length <= 0)
      axios.get(`${url}/Category/categoryList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function(res) {
        if(res.status == '200'){
            setCategories(res.data);
            res.data.map(x => categories.push(x));
        }
      });
      if(products.length <= 0)
      axios.get(`${url}/Products/productsList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function (res) {
        if(res.status == '200'){
            setProducts(res.data);
            res.data.map(x => products.push(x));
        }
      });
});

function searchProducts(){
    if(searchValue == ""){
        axios.get(`${url}/Products/productsList`,{
            headers:{
                'content-type': 'text/json',
                'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
            }
          }).then(function (res) {
            if(res.status == '200'){
                setProducts(res.data);
                res.data.map(x => products.push(x));
            }
          });
    }
    axios.get(`${url}/Products/findProduct?productName=${searchValue}`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function (res) {
        if(res.status == '200'){
            setProducts(res.data);
            res.data.map(x => products.push(x));
        }
      });
}


    return(
        <div className="flexbox-row">
            <ManagerNavBar></ManagerNavBar>
            <div>
            <InputGroup style={{padding:20}} className="mb-3">
        <Form.Control
          
          placeholder="Product name"
          aria-label="Product name"
          aria-describedby="basic-addon2"
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <Button onClick={() => searchProducts()}  variant="outline-primary" id="button-addon2">
          Search
        </Button>
      </InputGroup>
            <ProducsTabel products = {products} categories ={categories} subCategories ={subCategories}></ProducsTabel>
            </div> 
        </div>
    );
}
export default UpdateProductPanel;