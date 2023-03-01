import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { searchProducts, selectValues } from '../../app/productsSlice';
import NavigationBar from '../NavigationBar/NavigationBar';
import ProductsControl from '../ProductsControl/ProductsControl';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import './SearchPage.css'


const SearchPage = () => {
    const location = useLocation();
    const assets = useSelector(selectValues);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(searchProducts({searchText: location.state.searchText}));
    },[]);
    return(<div>
        <NavigationBar/>
        <div className='main-grid'>
        <div className='products-grid'>
          <ProductsControl products={assets}></ProductsControl>
        </div>
        <div className='controls-grid'>
          <SubCategoriesFilter></SubCategoriesFilter>
        </div>
      </div>
    </div>)
}

export default SearchPage;