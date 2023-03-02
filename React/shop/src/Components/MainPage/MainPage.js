import NavigationBar from '../NavigationBar/NavigationBar';
import PopularProducts from '../PopularProducts/PopularProducts';

const MainPage = () => {
  return(
    <div className='main-padding'>
      <NavigationBar ></NavigationBar>
      <PopularProducts></PopularProducts>   
  </div>
);
}

export default MainPage;