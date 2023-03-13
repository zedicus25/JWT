import {Component} from 'react';
import './ProductCard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

class ProductCard extends Component{
    constructor(props){
        super(props);
    }

 buyProduct() {
    let token = sessionStorage.getItem('token');
    if(token == null || token == '')
        alert("Log in or register to purchase");
}


    render(){
        return (
            <Card className='card' id={this.props['productId']}>
      <Card.Img variant="top" style={{width:'100%', height:'100%',}} src={this.props['productImg']} />
      <Card.Body>
        <Card.Title className='name-label'>{this.props['productName']}</Card.Title>
        <div className='space-between'>
            <div className='price-label'>${this.props['productPrice']}</div>
            <Button variant="link" onClick={() => this.buyProduct()}>
                <img className='cart-icon' src='https://cdn-icons-png.flaticon.com/512/1170/1170678.png'></img>
                Add to cart
            </Button>
        </div>
       
      </Card.Body>
    </Card>
        );
    }
}

export default ProductCard;