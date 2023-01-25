function load(){
    LoadCategories();
    LoadProducts();
}
let categories;
function LoadCategories() {
    try {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://localhost:7167/api/Category/categoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },
            success: function (data)
            {
                categories = data;
            }
        });
    }
    catch (ex) { }
}
function LoadProducts() {
    try {
        $.ajax({
            async: true,
            type: "GET",
            url: "https://localhost:7167/api/Products/productsList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },
            success: function (data)
            {
                let container = document.getElementById('mainContainer');
                data.forEach(p => {
                    let divWrap = document.createElement('div');
                    divWrap.setAttribute('class', 'card');
                    divWrap.setAttribute('style', 'width:18rem;');
                    let img = document.createElement('img');
                    img.setAttribute('src', p.photo);
                    img.setAttribute('class', 'card-img-top');
                    img.setAttribute('alt',p.name);
                    let cardBody = document.createElement('div');
                    cardBody.setAttribute('class','card-body');
                    let h5 = document.createElement('h5');
                    h5.setAttribute('class','card-title');
                    h5.innerText = p.name;
                    let h51 = document.createElement('h5');
                    h51.setAttribute('class','card-title');
                    h51.innerText = p.price + "₴";
                    let h6 = document.createElement('h6');
                    h6.setAttribute('class','card-subtitle mb-2 text-muted');
                    h6.innerText = p.model;
                    let h61 = document.createElement('h6');
                    h61.setAttribute('class','card-subtitle mb-2 text-muted');
                    h61.innerText = categories.find(x => x.id === p.categoryId).name;
                    divWrap.append(img);
                    divWrap.append(cardBody);
                    cardBody.append(h5);
                    cardBody.append(h51);
                    cardBody.append(h6);
                    cardBody.append(h61);
                    container.append(divWrap);
                });
            }
        });
    }
    catch (ex) { }
}

document.addEventListener('DOMContentLoaded', load);
