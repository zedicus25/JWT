function load(){
loadCategories();
loadProducts();
loadSubCategories();
}

function loadCategories(){
    $.ajax({
        async: true,
        type: "GET",
        url: `https://localhost:7167/api/Category/categoryList`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (categories)
        {
            let parent = $("#mainNavbar");
            categories.forEach(p => {
            let div = document.createElement('div');
            div.setAttribute('class','padding-15');
            div.setAttribute('id',`categoryId=${p.id}`);
            div.addEventListener("click", () => {
                if(sessionStorage.getItem("AccessToken") == null)
                    return;
                sessionStorage.setItem('CategoryId', `categoryId=${p.id}`);
                loadProducts();
            });
            div.innerText = p.name;
            parent.append(div);
        });
        }
    });
}

function loadSubCategories(){
    $.ajax({
        async: true,
        type: "GET",
        url: `https://localhost:7167/api/Category/subCategoryList`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (categories)
        {
            let parent = $("#subCategoriesList");
            categories.forEach(p => {
                let li = document.createElement('li');
                let div = document.createElement('div');
                div.setAttribute('class','form-check');
                let input = document.createElement('input');
                input.setAttribute('class','form-check-input');
                input.setAttribute('type','checkbox');
                input.setAttribute('id',`categoriesId=${p.id}`);
                let label = document.createElement('label');
                label.setAttribute('class','form-check');
                label.setAttribute('for','flexCheckDefault');
                label.innerText = p.name;
                div.append(input);
                div.append(label);
                li.append(div);
                parent.append(li);
        });
        let applyBtn = document.createElement('input');
        applyBtn.setAttribute('class','btn btn-primary margin-10');
        applyBtn.setAttribute('value','Apply');
        applyBtn.addEventListener('click', () =>{
            findProductsInSubCategories();
        });
        parent.append(applyBtn);
        }
    });
}


function loadProducts(){
    $.ajax({
        async: true,
        type: "GET",
        url: `https://localhost:7167/api/Products/getProductsInCategory?${sessionStorage.getItem('CategoryId')}`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (products)
        {
            $("#allCardsContainer").empty();
            products.forEach(prod => {
                let divWrap = document.createElement('div');
                divWrap.setAttribute('class','card margin-10');
                divWrap.setAttribute('style',"width: 18rem;");
                let img = document.createElement('img');
                img.setAttribute('class','card-img-top');
                img.setAttribute('src',prod.photo);
                img.setAttribute('alt',prod.photo);
                let divInner = document.createElement('div');
                divInner.setAttribute('class','card-body');
                let h5 = document.createElement('h5');
                h5.setAttribute('class','card-title');
                h5.innerText = prod.name;
                let h51 = document.createElement('h6');
                h51.setAttribute('class','card-subtitle mb-2 text-muted');
                h51.innerText = prod.price + "$";
                let btn = document.createElement('input');
                btn.setAttribute('type','button');
                btn.setAttribute('value','Buy');
                btn.setAttribute('class','btn btn-primary');
                divWrap.append(img);
                divWrap.append(divInner);
                divInner.append(h5);
                divInner.append(h51);
                divInner.append(btn);
                $("#allCardsContainer").append(divWrap);
            });
            
        }
    });
}

function findProductsInSubCategories(){
    let checks = document.getElementsByClassName('form-check-input');
    let path = 'https://localhost:7167/api/Products/getProductsInSubCategories?';
    for(let i = 0; i < checks.length; i++){
        if(checks[i].checked){
            path += checks[i].id + "&";
        }
    }
    if(path[path.length-1] === '?'){
        loadProducts();
        return;
    }
    path+=sessionStorage.getItem('CategoryId');
    $.ajax({
        async: true,
        type: "GET",
        url: path,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (products){
            $("#allCardsContainer").empty();
            products.forEach(prod => {
                let divWrap = document.createElement('div');
                divWrap.setAttribute('class','card margin-10');
                divWrap.setAttribute('style',"width: 18rem;");
                let img = document.createElement('img');
                img.setAttribute('class','card-img-top');
                img.setAttribute('src',prod.photo);
                img.setAttribute('alt',prod.photo);
                let divInner = document.createElement('div');
                divInner.setAttribute('class','card-body');
                let h5 = document.createElement('h5');
                h5.setAttribute('class','card-title');
                h5.innerText = prod.name;
                let h51 = document.createElement('h6');
                h51.setAttribute('class','card-subtitle mb-2 text-muted');
                h51.innerText = prod.price + "$";
                let btn = document.createElement('input');
                btn.setAttribute('type','button');
                btn.setAttribute('value','Buy');
                btn.setAttribute('class','btn btn-primary');
                divWrap.append(img);
                divWrap.append(divInner);
                divInner.append(h5);
                divInner.append(h51);
                divInner.append(btn);
                $("#allCardsContainer").append(divWrap);
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', load);