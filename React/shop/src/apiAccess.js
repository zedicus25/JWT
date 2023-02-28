import axios from "axios";
import token from './jwtToken';

const apiUrl = "https://jwt20230228183505.azurewebsites.net/api";


const get = async (url) => {
    let res = [];
    await axios.get(url, {
        headers: {
            'Authorization': "Bearer " + token.getToken()
        }
    }).then(function(response){
        if(response.status == '200'){
            res = response.data;
        }
        
    });
    return res;
}
const post = async(url, data) => {
    let res = {};

    await axios.post(url, JSON.stringify(data), {
        headers:{
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token.getToken()
        }
    }).then(function(response) {
        if(response.data.token)
            token.setToken(response.data.token);
        res = response;
    }).catch(() => res = undefined); 
    return res;
}

//--------------subcategories----------------
const getSubCategories = async () => { 
    return await get(`${apiUrl}/Category/subCategoryList`);
}

//-------------------products-------------------

const getAllAssets = async () => {
    return await get(`${apiUrl}/Products/productsList`);
}

const getPopularAssets = async () => {
    return await get(`${apiUrl}/Products/getPopularProducts`);
}

const getProductsInCategory = async (state) => {
  
    let res = await get(`${apiUrl}/Products/getProductsInCategory?categoryId=${state.categoryId}`);
    return res;
}


//--------------------authorization--------------------
const signIn = async(login, password) => {
    return await post(`${apiUrl}/Authentication/login`, {Password: password, UserName: login});
}

const signUp = async(login, email, password) => {
    return await post(`${apiUrl}/Authentication/regUser`, {Email:email,Password: password, UserName: login});
}

const methods = {
    getSubCategories: getSubCategories,
    getAllAssets: getAllAssets,
    getPopularAssets: getPopularAssets,
    getProductsInCategory: getProductsInCategory,
    signIn : signIn,
    signUp : signUp
}

export default methods;