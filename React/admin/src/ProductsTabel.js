import axios from "axios";
import { Component } from "react";
import { ProductRow } from "./ProductRow";
import './ProductsTabel.css';
import { UpdateModal } from "./UpdateModal";

export class ProducsTabel extends Component{
    constructor(props){
        super(props);
        this.state ={
            modalShow: false,
            selectedproduct: ""
        }
    }


    setStatus(productId,statusId){
        axios.post(`http://wonof44260-001-site1.itempurl.com/api/Products/setStatus?productId=${productId}&statusId=${statusId}`,{},{
            headers:{
                'content-type': 'text/json',
                'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
            }
          }).then(function(res){
        if(res.status == '200')
            alert('Saved!');
      });
    }
    render(){
        return(
            <div style={{padding:20}}>
                <table>
                    <thead>
                        <tr>
                            <td>Id</td>
                            <td>Name</td>
                            <td>Price</td>
                            <td>Image</td>
                            <td>Category</td>
                            <td>Sub Category</td>
                            <td>Sold</td>
                            <td>Quantity</td>
                            <td>Visibility</td>
                            <td>Popular</td>
                            <td>Actions</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.props['products'].map((x, idx)=> (
                            <tr onClick={() => {
                                this.setState({modalShow: true});
                                this.setState({selectedproduct: x});
                            }} id={`productId=${x.id}`} key = {idx}>
                                <td>{x.id}</td>
                                <td>{x.name}</td>
                                <td>{x.price}$</td>
                                <td><img src={x.photo} alt={x.photo} style={{width:50, height:50}}></img></td>
                                <td>{this.props['categories'].find(y => y.id==x.categoryId).name}</td>
                                <td>{this.props['subCategories'].find(y => y.id ==x.subCategoryId).name}</td>
                                <td>{x.sold}</td>
                                <td>{x.quantity}</td>
                                <td><input onChange={(e) => this.setStatus(x.id, e.target.checked ? 1 : 2)} type='checkbox' defaultChecked={x.statusId === 1}></input></td>
                                <td><input onChange={(e) => this.setStatus(x.id, e.target.checked ? 4 : 1)} type='checkbox' defaultChecked={x.statusId === 4}></input></td>
                                <td><input onClick={() => this.setStatus(x.id, 3)} type='button' value='Delete' className="btn btn-danger"></input></td>  
                            </tr>                           
                        ))}
                    </tbody>
                </table>
                <UpdateModal subcategories={this.props.subCategories} categories={this.props.categories} selectedproduct={this.state.selectedproduct} onHide={() => this.setState({modalShow: false})} show={this.state.modalShow}></UpdateModal>
            </div>
        );
    }
}