import NavigationBar from '../NavigationBar/NavigationBar';
import "./ThreeDPage.css";
import { Component, useEffect, useState } from 'react';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import ProductsControl from '../ProductsControl/ProductsControl';

class ThreeDPage extends Component {
  constructor(props){
    super(props);
  }

   componentDidMount() {
    if(this.props.products.length > 0)
      console.log("3d load")
   }
 

    render (){    
      return(
        <div>
      <NavigationBar 
        twoDClick={this.props.twoDClick} 
        threeDClick={this.props.threeDClick} 
        vfxClick = {this.props.vfxClick}
        addOnsClick={this.props.addOnsClick}
        audioClick={this.props.audioClick}>
        </NavigationBar>
      <div className='main-grid'>
        <div className='products-grid'>
          <ProductsControl  products={this.props['products']}></ProductsControl>
        </div>
        <div className='controls-grid'>
          <SubCategoriesFilter subCategoriClick={this.props.subCategoriClick}  subCategories = {this.props.subCategories}></SubCategoriesFilter>
        </div>
      </div>
    </div>
      );
    }
  }
  
  export default ThreeDPage;