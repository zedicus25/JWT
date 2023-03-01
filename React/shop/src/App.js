import './App.css';
import MainPage from './Components/MainPage/MainPage';
import ThreeDPage from './Components/ThreeDPage/ThreeDPage';
import TwoDPage from './Components/TwoDPage/TwoDPage';
import AudioPage from './Components/AudioPage/AudioPage';
import VFXPage from './Components/VFXPage/VFXPage';
import AddOnsPage from './Components/AddOnsPage/AddOnsPage'
import MainManagerPage from './ManagerComponents/MainManagerPage/MainManagerPage';
import MainAdminPage from './AdminComponents/MainAdminPage/MainAdminPage';
import SearchPage from './Components/SearchPage/SearchPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App = () => {
  return(
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainPage/>}></Route>
          <Route path='/threedpage' element={<ThreeDPage/>}></Route>
          <Route path='/twodpage' element={<TwoDPage/>}></Route>
          <Route path='/addonspage' element={<AddOnsPage/>}></Route>
          <Route path='/audiopage' element={<AudioPage/>}></Route>
          <Route path='/vfxpage' element={<VFXPage/>}></Route>
          <Route path='/searchPage' element={<SearchPage/>}></Route>
          <Route path='/manager' element={<MainManagerPage/>}></Route>
          <Route path='/admin' element={<MainAdminPage/>}></Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
