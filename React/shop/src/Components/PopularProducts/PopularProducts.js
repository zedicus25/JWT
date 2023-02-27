import { Component } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './PopularProducts.css'

class PopularProducts extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let items = this.props['products'].map(x => {
            return <ProductCard key={`productdId=${x.id}`} productId={`productdId=${x.id}`} productImg={x.photo} productName={x.name} productPrice={x.price}></ProductCard>
        });
        return(
            <div className='popular-products-wrap'>
                <h1>Popular assests:</h1>
                <div className='flexbox'>
                    {items}
                </div>
            </div>  
        );
    }
}
export default PopularProducts;