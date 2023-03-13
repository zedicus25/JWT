import { Component } from "react";

export class ProductRow extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <tbody>
            <tr>
                <td>{this.props.productId}</td>
                <td>{this.props.productName}</td>
                <td>{this.props.productPrice}</td>
                <td>{this.props.productImg}</td>
                <td>{this.props.categoryName}</td>
                <td>{this.props.subCategoryName}</td>
                <td>{this.props.sold}</td>
                <td>{this.props.quantity}</td>
            </tr>
            </tbody>
        );
    }
}