import ProductCard from '../ProductCard/ProductCard';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPopularAsync as getPopularAssets, selectValues as selectPopularProducts } from '../../app/productsSlice';
import './PopularProducts.css'

const PopularProducts = () => {
    const popularProducts = useSelector(selectPopularProducts);
    const dispatch = useDispatch();

  
    useEffect(() => {
      dispatch(getPopularAssets());
    }, []);

    return(
        <div className='popular-products-wrap'>
            <h1>Popular assests:</h1>
            <div className='flexbox'>
                {popularProducts.map((x, idx) => {
                    return <ProductCard key={idx} productId={`productdId=${x.id}`} productImg={x.photo} productName={x.name} productPrice={x.price}></ProductCard>
                })}
            </div>
        </div>
    )
}

export default PopularProducts;