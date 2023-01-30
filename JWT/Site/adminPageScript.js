function load(){
LoadCategories();
}

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
                data.forEach((element) => {
                    let table = document.getElementById("mainTable");
                    let tr = document.createElement('tr');
                    tr.setAttribute('class','contentCenterAlign');
                    tr.append(createTdWithInnerText(element.id));
                    tr.append(createTdWithInnerText(element.name));
                    $.ajax({
                        async: true,
                        type: "GET",
                        url: `https://localhost:7167/api/Category/productsCountInCategory?categoryId=${parseInt(element.id)}`,
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
                            url: `https://localhost:7167/api/Products/getProductsInCategory?categoryId=${parseInt(element.id)}`,
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
                                tr.append(createTdWithInnerText(p.name));
                                tr.append(createTdWithInnerText(p.model));
                                tr.append(createTdWithInnerImage(p.photo));
                                tr.append(createTdWithInnerText(p.price));
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
    tr.append(createTdWithInnerText('Name'));
    tr.append(createTdWithInnerText('Model'));
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
    div.setAttribute("class",'flexBox flexBox-horizontal');
    let deleteBtn = document.createElement("input");
    deleteBtn.setAttribute('type','button');
    deleteBtn.setAttribute('class','btn btn-danger');
    deleteBtn.setAttribute('value','Delete');
    deleteBtn.addEventListener('click', () => {
        $.ajax({
            async: true,
            type: "DELETE",
            url: `https://localhost:7167/api/Products/deleteProduct?productId=${productId}`,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },  
            success: function (response) {
                parentNode.remove();
                alert("Deleted");
                return;
            }
        });
    });
    let updateBtn = document.createElement("input");
    updateBtn.setAttribute('type','button');
    updateBtn.setAttribute('class','btn btn-warning');
    updateBtn.setAttribute('value','Update');
    updateBtn.addEventListener('click', () => {
        
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
            url: `https://localhost:7167/api/Products/setStatus?productId=${productId}&statusId=${checBox.checked? 1 : 2}`,
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


document.addEventListener("DOMContentLoaded", load);