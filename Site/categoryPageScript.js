function load() {
    loadCategories();
}


function loadCategories() {

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
                console.log(data);
                data.forEach((element) => {
                    let table = document.getElementById("mainTable");
                    let tr = document.createElement('tr');
                    let tdId = document.createElement('td');
                    tdId.innerText = element.id;
                    let tdName = document.createElement('td');
                    tdName.innerText = element.name;
                    let tdCount = document.createElement('td');
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
                           tdCount.innerText = count;
                        }
                    });
                    tr.append(tdId);
                    tr.append(tdName);
                    tr.append(tdCount);
                    table.append(tr);
                });
            }
        });
    }
    catch (ex) { }
}

document.addEventListener('DOMContentLoaded', load);