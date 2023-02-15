import './App.css';
import NavigationBar from './NavigationBar';
import ThreeDPage from './ThreeDPage';
import TwoDPage from './TwoDPage';
import AddOnsPage from './AddOnsPage';
import AudioPage from './AudioPage';
import VFXPage from './VFXPage';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import PopularProducts from './PopularProducts';

function App() {

  const url = "http://wonof44260-001-site1.itempurl.com/api";

  let [products, setProducts] = useState([]);

  document.addEventListener('DOMContentLoaded', async ()  => {
    await axios.get(`${url}/Products/getPopularProducts`).then(function (response) {
      if(response.status == 200){
        setProducts(response.data);
        response.data.map(x => {
          products.push(x);
        });
      }
    });
  });

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<NavigationBar/>}></Route>
      <Route path='/threedpage' element={<ThreeDPage/>}></Route>
      <Route path='/twodpage' element={<TwoDPage/>}></Route>
      <Route path='/addonspage' element={<AddOnsPage/>}></Route>
      <Route path='/audiopage' element={<AudioPage/>}></Route>
      <Route path='/vfxpage' element={<VFXPage/>}></Route>
    </Routes>
    <PopularProducts products={products}></PopularProducts>
    </BrowserRouter>
    
  );
}

export default App;
