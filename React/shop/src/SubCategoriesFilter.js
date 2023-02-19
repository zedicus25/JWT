import { Component } from "react";
import Form from 'react-bootstrap/Form';
import axios from 'axios';

class SubCategoriesFilter extends Component{
    constructor(props){
        super(props);
        
    }

    render(){

        let items = this.props.subCategories.map(x => {
            return <Form.Check onClick={this.props.subCategoriClick}  key={`subCategory=${x.id}`} id={`subCategory=${x.id}`} type='checkbox' className="subcategory-input" label={x.name}></Form.Check >
        });
    

        return(
            <div>
               <h5>Filters:</h5> 
                {items}
            </div>
        );
    }
}

export default SubCategoriesFilter;