import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
  
export function UpdateModal(props){
    const [prodName, setProdName] = useState("");
    const [prodPrice, setProdPrice] = useState("");
    const [prodPhoto, setProdPhoto] = useState("");
    const [prodQuantity, setProdQuantity] = useState("");
    const [prodSold, setProdSold] = useState("");
    const [prodCatId, setProdCatId] = useState("");
    const [prodSubCatId, setProdSubCatId] = useState("");


function setDefault(){
    setProdName("");
    setProdPrice("");
    setProdPhoto("");
    setProdQuantity("");
    setProdSold("");
    setProdCatId("");
    setProdSubCatId("");
}

    return (
        <Modal
          {...props}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Update products:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <form>
                <div className="form-group mt-3">
                    <label>Product name</label>
                    <input onChange={(e) => setProdName(e.target.value)}  value={prodName == "" ? props.selectedproduct.name : prodName} className="form-control mt-1" type='text' placeholder='Name'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Product price</label>
                    <input onChange={(e) => setProdPrice(e.target.value)}  value={prodPrice == "" ? props.selectedproduct.price : prodPrice}  className="form-control mt-1" type='number' min='1' placeholder='Price'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Product image url</label>
                    <input onChange={(e) => setProdPhoto(e.target.value)} value={prodPhoto == "" ?props.selectedproduct.photo:prodPhoto}   className="form-control mt-1" type='url' placeholder='Image url'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Quantity count</label>
                    <input onChange={(e) => setProdQuantity(e.target.value)}  value={ prodQuantity == ""? props.selectedproduct.quantity:prodQuantity}  className="form-control mt-1" min='1' type='number' placeholder='Quantity'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Sold count</label>
                    <input onChange={(e) => setProdSold(e.target.value)}  value={prodSold == "" ? props.selectedproduct.sold : prodSold}    className="form-control mt-1" min='1' type='number' placeholder='Sold'></input>
                </div>
                <div className="form-group mt-3">
                    <label>Category</label>
                    <select onChange={(e) => setProdCatId(e.target.value)} className="form-select" id='categoriesDrop'>
                        {props.categories.map((x, idx) => {
                            return <option selected={x.id == props.selectedproduct.categoryId} value={x.id} key={idx}>{x.name}</option>
                        })};
                    </select>
                </div>
                <div className="form-group mt-3">
                    <label>Sub category</label>
                    <select onChange={(e) => setProdSubCatId(e.target.value)} className="form-select" id='subCategoriesDrop'>
                        <option value='' disabled=''>Select</option>
                        {props.subcategories.map((x, idx) => {
                            return <option selected={x.id == props.selectedproduct.subCategoryId} value={x.id} key={idx}>{x.name}</option>
                        })};
                    </select>
                </div>
                <div className="form-group mt-3">
                    <input onClick={() => {
                        axios.put('http://wonof44260-001-site1.itempurl.com/api/Products/updateProduct', 
                        {id:props.selectedproduct.id,
                        name:prodName == "" ? props.selectedproduct.name : prodName, 
                        price:prodPrice == "" ? props.selectedproduct.price : prodPrice, 
                        photo:prodPhoto == "" ? props.selectedproduct.photo : prodPhoto, 
                        categoryId:prodCatId == "" ? props.selectedproduct.categoryId : prodCatId, 
                        subCategoryId:prodSubCatId == "" ? props.selectedproduct.subCategoryId : prodSubCatId, 
                        quantity:prodQuantity == "" ? props.selectedproduct.quantity : prodQuantity, 
                        sold:prodSold == "" ? props.selectedproduct.sold : prodSold, 
                        statusId:props.selectedproduct.statusId}, {
                            headers:{
                                'content-type': 'text/json',
                                'Authorization': 'Bearer ' +  sessionStorage.getItem("token")
                            }
                        }).then(function(res){
                            if(res.status == "200")
                                alert('Product updated!');
                        });
                        props.onHide();
                        setDefault();
                    }} type='button' className="btn btn-primary" value='Update product'></input>
                </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={props.onHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      );
}