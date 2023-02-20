import './App.css';
import LoginForm from './LoginForm';
import ManagerMainPage from './ManagerMainPage';
import AdminrMainPage from './AdminMainPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddProductPanel from './AddProductPanel';
import UpdateProductPanel from './UpdateProductPanel';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginForm></LoginForm>}></Route>
        <Route path='/managermainpage' element={<ManagerMainPage></ManagerMainPage>}></Route>
        <Route path='/adminmainpage' element={<AdminrMainPage></AdminrMainPage>}></Route>
        <Route path='/addproductpanel' element={<AddProductPanel></AddProductPanel>}></Route>
        <Route path='/updateproductpanel' element={<UpdateProductPanel></UpdateProductPanel>}></Route>
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
