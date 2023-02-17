import './App.css';
import MainPage from './MainPage';
import NavigationBar from './NavigationBar';
import ThreeDPage from './ThreeDPage';
import TwoDPage from './TwoDPage';
import AddOnsPage from './AddOnsPage';
import AudioPage from './AudioPage';
import VFXPage from './VFXPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import { useState } from 'react';
import { Alert } from 'bootstrap';

function App() {


  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/threedpage' element={<ThreeDPage/>}></Route>
          <Route path='/twodpage' element={<TwoDPage/>}></Route>
          <Route path='/addonspage' element={<AddOnsPage/>}></Route>
          <Route path='/audiopage' element={<AudioPage/>}></Route>
          <Route path='/vfxpage' element={<VFXPage/>}></Route>
        </Routes>
        </BrowserRouter>
  );
}

export default App;
