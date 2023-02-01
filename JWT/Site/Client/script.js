function load() {loadCategories();}

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
                $.ajax({
                    async: true,
                    type: "GET",
                    url: `https://localhost:7167/api/Products/getProductsInCategory?categoryId=${p.id}`,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
                    },  
                    success: function (products)
                    {
                        $("#allcardsContainer").empty();
                        products.forEach(prod => {
                            let divWrap = document.createElement('div');
                            divWrap.setAttribute('class','card');
                            divWrap.setAttribute('style',"width: 18rem;");
                            let img = document.createElement('img');
                            img.setAttribute('class','card-img-top');
                            img.setAttribute('src',prod.photo);
                            img.setAttribute('alt',prod.photo);
                            let divInner = document.createElement('div');
                            divInner.setAttribute('class','card-body');
                            let h5 = document.createElement('h5');
                            h5.setAttribute('class','card-title');
                            h5.innerText = prod.name + " "+ prod.model;
                            let h51 = document.createElement('h6');
                            h51.setAttribute('class','card-subtitle mb-2 text-muted');
                            h51.innerText = prod.price + "₴";
                            let btn = document.createElement('input');
                            btn.setAttribute('type','button');
                            btn.setAttribute('value','Buy');
                            btn.setAttribute('class','btn btn-primary');
                            divWrap.append(img);
                            divWrap.append(divInner);
                            divInner.append(h5);
                            divInner.append(h51);
                            divInner.append(btn);
                            $("#allcardsContainer").append(divWrap);
                        });
                    }
                });
            });
            div.innerText = p.name;
            parent.append(div);
          });
        }
    });
}
document.addEventListener('DOMContentLoaded', load);