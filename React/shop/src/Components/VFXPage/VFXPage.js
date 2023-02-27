import NavigationBar from '../NavigationBar/NavigationBar';
import "./VFXPage.css";
import { Component, useEffect, useState } from 'react';
import SubCategoriesFilter from '../SubCategoriesFilter/SubCategoriesFilter';
import ProductsControl from '../ProductsControl/ProductsControl';

class VFXPage extends Component {
  constructor(props){
    super(props);
  }

  

    render (){     
      return(
        <div>
      <NavigationBar 
      vfxClick = {this.props.vfxClick} 
      twoDClick={this.props.twoDClick}  
      threeDClick={this.props.threeDClick}
      addOnsClick={this.props.addOnsClick}
      audioClick={this.props.audioClick}></NavigationBar>
      <div className='main-grid'>
        <div className='products-grid'>
          <ProductsControl products={this.props.products}></ProductsControl>
        </div>
        <div className='controls-grid'>
          <SubCategoriesFilter subCategoriClick={this.props.subCategoriClick}   subCategories = {this.props.subCategories}></SubCategoriesFilter>
        </div>
      </div>
    </div>
      );
    }
  }
  
  export default VFXPage;