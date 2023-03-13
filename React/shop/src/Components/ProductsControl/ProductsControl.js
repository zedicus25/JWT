import { Component } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductsControl.css'

class ProductsControl extends Component{
    constructor(props){
        super(props);
        
    }

    render(){
        let items = this.props.products.map((x, idx) => {
            return <ProductCard key={`3dProduct=${idx}`} productId={`productdId=${x.id}`} productImg={x.photo} productName={x.name} productPrice={x.price}></ProductCard>
        });
       
        return(
            <div className='products-wrap'>
                <div id='allproducts' className='flexbox'>
                    {items}
                </div>
            </div>  
        );
    }
}
export default ProductsControl;