function load(){
LoadCategories();
$("#addBtn").click(() => {
    addProduct();
    location.reload();
});
$("#findBtn").click(() => {
findProducts($("#findInput").val());
});
}

function LoadCategories() {
    try {
        $.ajax({
            async: true,
            type: "GET",
            url: "http://wonof44260-001-site1.itempurl.com/api/Category/categoryList",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },
            success: function (data)
            {
                data.forEach((element) => {
                    let table = document.getElementById("mainTable");
                    let tr = document.createElement('tr');
                    tr.setAttribute('class','contentCenterAlign');
                    tr.append(createTdWithInnerText(element.id));
                    tr.append(createTdWithInnerText(element.name));
                    $.ajax({
                        async: true,
                        type: "GET",
                        url: `http://wonof44260-001-site1.itempurl.com/api/Category/productsCountInCategory?categoryId=${parseInt(element.id)}`,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        headers: {
                            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
                        },
                        success: function (count)
                        {
                            tr.append(createTdWithInnerText(count));
                        }
                    });
                    tr.addEventListener('click', () => {
                        let table = document.getElementById("productsTable");
                        table.innerHTML ="";
                        createHeadersForProductsTable();
                        $.ajax({
                            async: true,
                            type: "GET",
                            url: `http://wonof44260-001-site1.itempurl.com/api/Products/getProductsInCategory?categoryId=${parseInt(element.id)}`,
                            contentType: "application/json; charset=utf-8",
                            dataType: "json",
                            headers: {
                                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
                            },  
                            success: function (products)
                            {
                              products.forEach(p => {
                                let tr = document.createElement('tr');
                                tr.setAttribute('class','contentCenterAlign');
                                tr.append(createTdWithInnerText(p.id));
                                tr.append(createTdWithInnerText(p.categoryId));
                                tr.append(createTdWithInnerText(p.subCategoryId));
                                tr.append(createTdWithInnerText(p.name));
                                tr.append(createTdWithInnerImage(p.photo));
                                tr.append(createTdWithInnerText(p.price + "$"));
                                tr.append(createTdWithInnerText(p.quantity));
                                tr.append(createTdWithInnerText(p.sold));
                                createControlButtons(tr, p.id);
                                tr.append(createTdWithCheckBox((p.statusId == 1),p.id));
                                table.append(tr);
                              });
                            }
                        });
                    });
                    table.append(tr);
                });
            }
        });
    }
    catch (ex) { }
}

function createTdWithInnerText(innerText){
    let td = document.createElement("td");
    td.innerText = innerText;
    return td;
}
function createTdWithInnerImage(imgUrl){
    let td = document.createElement("td");
    let img = document.createElement("img");
    img.setAttribute('src', imgUrl);
    img.setAttribute('alt', imgUrl);
    img.setAttribute('class', "adminPanelImg");
    td.append(img);
    return td;
}

function createHeadersForProductsTable(){
    let table = document.getElementById("productsTable");
    let tr = document.createElement('tr');
    tr.setAttribute('id','productsTitles');
    tr.setAttribute('class','contentCenterAlign');
    tr.append(createTdWithInnerText('Id'));
    tr.append(createTdWithInnerText('Category'));
    tr.append(createTdWithInnerText('SubCategoryId'));
    tr.append(createTdWithInnerText('Name'));
    tr.append(createTdWithInnerText('Photo'));
    tr.append(createTdWithInnerText('Price'));
    tr.append(createTdWithInnerText('Quantity'));
    tr.append(createTdWithInnerText('Sold'));
    tr.append(createTdWithInnerText('Actions'));
    tr.append(createTdWithInnerText('Visibility'));
    table.append(tr);
}

function createControlButtons(parentNode, productId) {
    let td = document.createElement('td');
    let div = document.createElement("div");
    div.setAttribute("class",'flexBox flexBox-vertical');
    let deleteBtn = document.createElement("input");
    deleteBtn.setAttribute('type','button');
    deleteBtn.setAttribute('class','btn btn-danger');
    deleteBtn.setAttribute('value','Delete');
    deleteBtn.addEventListener('click', () => {
        $.ajax({
            async: true,
            type: "DELETE",
            url: `http://wonof44260-001-site1.itempurl.com/api/Products/deleteProduct?productId=${productId}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },  
            success: function (response) {
            }
        });
        alert("Deleted");
        location.reload();
    });
    let updateBtn = document.createElement("input");
    updateBtn.setAttribute('type','button');
    updateBtn.setAttribute('class','btn btn-warning');
    updateBtn.setAttribute('value','Update');
    updateBtn.addEventListener('click', () => {
        $.ajax({
            async: true,
            type: "GET",
            url: `http://wonof44260-001-site1.itempurl.com/api/Products/getProduct?productId=${productId}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },  
            success: function (response) {
                $("#updateInput").attr("class", "flexBox flexBox-vertical visible");
                $("#nameUpdateInput").val(response.name);
                $("#idUpdateInput").val(response.id);
                $("#subCategoryIdUpdateInput").val(response.subCategoryId);
                $("#categoryIdUpdateInput").val(response.categoryId);
                $("#photoUpdateInput").val(response.photo);
                $("#priceUpdateInput").val(response.price);
                $("#quantityUpdateInput").val(response.quantity);
                $("#soldUpdateInput").val(response.sold);
                $("#visibleUpdateInput").checked = response.statusId == 1 ? true : false;
                $("#saveBtn").click(() =>{
                    updateProduct();
                    location.reload();
                });
            }
        });
    });
    div.append(deleteBtn);
    div.append(updateBtn);
    td.append(div);
    parentNode.append(td);
}

function createTdWithCheckBox(checked, productId){
    let td = document.createElement('td');
    let checBox = document.createElement('input');
    checBox.setAttribute('type','checkbox');
    checBox.checked = checked;
    checBox.addEventListener('click', () =>{
        $.ajax({
            async: true,
            type: "POST",
            url: `http://wonof44260-001-site1.itempurl.com/api/Products/setStatus?productId=${productId}&statusId=${checBox.checked? 1 : 2}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },  
            success: function (response) {
                alert("Updated");
            }
        });
    });
    td.append(checBox);
    return td;
}

function updateProduct(){
    let product ={
        category: null,
        categoryId: $("#categoryIdUpdateInput").val(),
        id: $('#idUpdateInput').val(),
        subCategoryId: $("#subCategoryIdUpdateInput").val(),
        name: $("#nameUpdateInput").val(),
        photo: $("#photoUpdateInput").val(),
        price: $("#priceUpdateInput").val(),
        quantity: $("#quantityUpdateInput").val(),
        sold: $("#soldUpdateInput").val(),
        status: null,
        statusId: $("#visibleUpdateInput").checked == true ? 2 : 1
    };
    $.ajax({
        async: true,
        type: "PUT",
        url: `http://wonof44260-001-site1.itempurl.com/api/Products/updateProduct`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(product),
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (response) {
        }
    });
    alert("Updated!");
    $("#updateInput").attr("class", "flexBox flexBox-vertical unVisible");
    $("#nameUpdateInput").val("");
    $("#idUpdateInput").val("");
    $("#subCategoryIdUpdateInput").val("");
    $("#categoryIdUpdateInput").val("");
    $("#photoUpdateInput").val("");
    $("#priceUpdateInput").val("");
    $("#quantityUpdateInput").val("");
    $("#soldUpdateInput").val("");
}

function addProduct(){
    let product ={
        category: null,
        categoryId: $("#categoryIdAddInput").val(),
        id: 0,
        subCategoryId: $("#subCategoryAddInput").val(),
        name: $("#nameAddInput").val(),
        photo: $("#photoAddInput").val(),
        price: $("#priceAddInput").val(),
        quantity: $("#quantityAddInput").val(),
        sold: $("#soldAddInput").val(),
        status: null,
        statusId: $("#visibleAddInput").checked == true ? 2 : 1
    };
    $.ajax({
        async: true,
        type: "POST",
        url: `http://wonof44260-001-site1.itempurl.com/api/Products/addProduct`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(product),
        headers: {
            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
        },  
        success: function (response) {
        }
    });
    alert("Added!");
    $("#nameAddInput").val("");
    $("#subCategoryAddInput").val("");
    $("#categoryIdAddInput").val("");
    $("#photoAddInput").val("");
    $("#priceAddInput").val("");
    $("#quantityAddInput").val("");
    $("#soldAddInput").val("");
    $("#visibleAddInput").checked = true;
}

function findProducts(name){
    if(name === "")
        return;
try {
                    $.ajax({
                        async: true,
                        type: "GET",
                        url: `http://wonof44260-001-site1.itempurl.com/api/Products/findProduct?productName=${name}`,
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        headers: {
                            'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
                        },  
                        success: function (products)
                        {
                            let table = document.getElementById("productsTable");
                        table.innerHTML ="";
                        createHeadersForProductsTable();
                          products.forEach(p => {
                            let tr = document.createElement('tr');
                            tr.setAttribute('class','contentCenterAlign');
                            tr.append(createTdWithInnerText(p.id));
                            tr.append(createTdWithInnerText(p.categoryId));
                            tr.append(createTdWithInnerText(p.subCategoryId));
                            tr.append(createTdWithInnerText(p.name));
                            tr.append(createTdWithInnerImage(p.photo));
                            tr.append(createTdWithInnerText(p.price + "$"));
                            tr.append(createTdWithInnerText(p.quantity));
                            tr.append(createTdWithInnerText(p.sold));
                            createControlButtons(tr, p.id);
                            tr.append(createTdWithCheckBox((p.statusId == 1),p.id));
                            table.append(tr);
                          });
                        }
                    });

}
catch (ex) { }
}
document.addEventListener("DOMContentLoaded", load);