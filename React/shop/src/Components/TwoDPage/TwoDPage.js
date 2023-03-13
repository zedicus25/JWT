import NavigationBar from '../NavigationBar/NavigationBar';
import "./TwoDPage.css";
import { useEffect } from 'react';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import ProductsControl from '../ProductsControl/ProductsControl';
import { useDispatch, useSelector } from 'react-redux';
import { getProductsInCategory, selectValues } from '../../app/productsSlice';

  const TwoDPage = () => {
    const assest = useSelector(selectValues);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(getProductsInCategory({categoryId : 2}));
      sessionStorage.setItem('categoryId', 2);
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
  
  
  export default TwoDPage;