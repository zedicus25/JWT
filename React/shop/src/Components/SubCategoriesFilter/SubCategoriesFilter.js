import { useEffect } from "react";
import Form from 'react-bootstrap/Form';
import {useSelector, useDispatch} from 'react-redux';
import { getAsync as getSubCat, selectValues as getSubCategories } from "../../app/subCategoriesSlice";

const SubCategoriesFilter = () => {
    const subCategories = useSelector(getSubCategories);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubCat());
    }, []);

    return (
        <div>
            <h5>Filters:</h5>
            {subCategories.map((x, idx) =>{
                return <Form.Check key={idx} id={`subCategory=${x.id}`} type='checkbox' className="subcategory-input" label={x.name}></Form.Check>
            })}
        </div>
    );
}

export default SubCategoriesFilter;