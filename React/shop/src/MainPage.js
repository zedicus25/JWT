import NavigationBar from './NavigationBar';
import ThreeDPage from './ThreeDPage';
import TwoDPage from './TwoDPage';
import AddOnsPage from './AddOnsPage';
import AudioPage from './AudioPage';
import VFXPage from './VFXPage';
import SearchResult from './SearchResult';
import PopularProducts from './PopularProducts';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { useState, useEffect } from 'react';
import { Alert } from 'bootstrap';

function MainPage(){

    const url = "http://wonof44260-001-site1.itempurl.com/api";

    const [products, setProducts] = useState([]);
    let searchText = "";
    const [visibly, setVisibility] = useState(true);
    const [canGet, setCanGet] = useState(true);
  
    useEffect(() => {
        if(canGet){
            axios.get(`${url}/Products/getPopularProducts`).then(function (response) {
                if(response.status == 200){
                  setProducts(response.data);
                  response.data.map(x => {
                    products.push(x);
                  });
                }
              });
        }
        
    });


    document.addEventListener('DOMContentLoaded', async ()  => {
        let searchBtn = document.getElementById('search-btn');
        searchBtn.addEventListener('click', () => searchAssets());
        let searchInput = document.getElementById('search-input');
        searchInput.addEventListener('change',(e) => {
          searchText = e.target.value;
        });
      });


    async function searchAssets(){
        if(searchText == ""){
            setCanGet(true);
            setVisibility(true);
            return;
        }
            
        setCanGet(false);
        setVisibility(false);   
        await axios.get(`${url}/Products/findProduct?productName=${searchText}`).then(function (response) {
          if(response.status == 200){
            setProducts(response.data);
            response.data.map(x => {
              products.push(x);
            });
          }
        });
      
      }



    return(
        <div>
               <NavigationBar></NavigationBar>
        <div id='displaying-products'>
      <div style={{display: visibly ? "block":'none'}}>
        <PopularProducts products={products}></PopularProducts>
      </div>
      <div style={{display: visibly ? "none":'block'}}>
        <SearchResult products={products}></SearchResult>
      </div>
    </div>
        </div>
     
        
    );
}

export default MainPage;