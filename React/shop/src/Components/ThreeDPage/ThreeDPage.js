import NavigationBar from '../NavigationBar/NavigationBar';
import "./ThreeDPage.css";
import { useEffect } from 'react';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import ProductsControl from '../ProductsControl/ProductsControl';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsInCategory, selectValues } from '../../app/productsSlice';

  const ThreeDPage = () => {
    const assest = useSelector(selectValues);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getProductsInCategory({categoryId : 1}));
      sessionStorage.setItem('categoryId', 1);
    }, []);

    return(
      <div className='main-padding'>
      <NavigationBar ></NavigationBar>
      <div className='main-grid'>
        <div className='products-grid'>
          <ProductsControl  products={assest}></ProductsControl>
        </div>
        <div className='controls-grid'>
          <SubCategoriesFilter></SubCategoriesFilter>
        </div>
      </div>
    </div>
    );
  };
  
  export default ThreeDPage;