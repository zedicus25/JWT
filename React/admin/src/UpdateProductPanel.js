import { useEffect, useState } from "react";
import ManagerNavBar from "./ManagerNavBar";
import axios from "axios";
import { ProducsTabel } from "./ProductsTabel";

function UpdateProductPanel() {
const url = "http://wonof44260-001-site1.itempurl.com/api";
const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [subCategories, setSubCategories] = useState([]);
useEffect(() =>{
    if(categories.length <= 0)
    axios.get(`${url}/Category/subCategoryList`,{
        headers:{
            'content-type': 'text/json',
            'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
        }
      }).then(function(res) {
        if(res.status == '200'){
            setSubCategories(res.data);
            res.data.map(x => subCategories.push(x));
           /* let parent = document.getElementById('subCategoriesDrop');
            parent.innerHTML = "";
            res.data.map(x => {
                let opt = document.createElement('option');
                opt.setAttribute('value', x.id);
                opt.innerText = x.name;
                parent.append(opt);
            });*/
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
            /*let parent = document.getElementById('categoriesDrop');
            parent.innerHTML = "";
            res.data.map(x => {
                let opt = document.createElement('option');
                opt.setAttribute('value', x.id);
                opt.innerText = x.name;
                parent.append(opt);
            });*/
        }
      });
      if(categories.length <= 0)
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

    return(
        <div className="flexbox-row">
            <ManagerNavBar></ManagerNavBar>
            <ProducsTabel products = {products} categories ={categories} subCategories ={subCategories}></ProducsTabel>
        </div>
    );
}
export default UpdateProductPanel;