import './App.css';
import MainPage from './Components/MainPage/MainPage';
import ThreeDPage from './Components/ThreeDPage/ThreeDPage';
import TwoDPage from './Components/TwoDPage/TwoDPage';
import AudioPage from './Components/AudioPage/AudioPage';
import VFXPage from './Components/VFXPage/VFXPage';
import AddOnsPage from './Components/AddOnsPage/AddOnsPage'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

  const url = "http://wonof44260-001-site1.itempurl.com/api";

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [products, setProducts] = useState([]);

useEffect(() => {
  if(subCategories.length === 0)
  axios.get(`${url}/Category/subCategoryList`).then(function(res){
    if(res.status == 200){
      setSubCategories(res.data);
      res.data.map(x => {
        subCategories.push(x);  
      });
    }
  });

  
});

 async function loadProductsInCategory(categoryId){
  
  await axios.get(`${url}/Products/getProductsInCategory?categoryId=${categoryId}`).then(function(res){
    if(res.status == 200){
      setProducts(res.data);
      res.data.map(x => {
        products.push(x);  
      });
    }
  });
}

async function loadProductsInSubCategories (catId) {  
  let inputs = document.getElementsByClassName('form-check-input');
  let subUrl = `${url}/Products/getProductsInSubCategories?`;
  for(let i = 0; i < inputs.length; i++){
    if(inputs[i].checked){
      subUrl += 'categoriesId=' + inputs[i].id.substring(inputs[i].id.indexOf('=')+1) + "&";
    }
    
}
if(subUrl[subUrl.length-1] === '?'){
  loadProductsInCategory(catId);
  return;
}
      
subUrl+=`categoryId=${catId}`;
await axios.get(subUrl).then(res => {
  if(res.status == '200'){
    setProducts(res.data);
    res.data.map(x => products.push(x));
  }
});
}


  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
         />}></Route>
          <Route path='/threedpage' element={<ThreeDPage products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
          subCategoriClick={() => loadProductsInSubCategories(1)}
          subCategories={subCategories}/>}></Route>
          <Route path='/twodpage' element={<TwoDPage  products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
          subCategoriClick={() => loadProductsInSubCategories(2)}
          subCategories={subCategories}/>}></Route>
          <Route path='/addonspage' element={<AddOnsPage products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
          subCategoriClick={() => loadProductsInSubCategories(3)}
          subCategories={subCategories}/>}></Route>
          <Route path='/audiopage' element={<AudioPage products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
          subCategoriClick={() => loadProductsInSubCategories(4)}
          subCategories={subCategories}/>}></Route>
          <Route path='/vfxpage' element={<VFXPage products={products} 
          threeDClick={() => {loadProductsInCategory(1)}} 
          twoDClick={() => loadProductsInCategory(2)} 
          addOnsClick={() => loadProductsInCategory(3)}
          audioClick={() => loadProductsInCategory(4)}
          vfxClick = {() => loadProductsInCategory(5)}
          subCategoriClick={() => loadProductsInSubCategories(5)}
          subCategories={subCategories}/>}></Route>
        </Routes>
        </BrowserRouter>
  );
}

export default App;
