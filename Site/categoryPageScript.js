function load() {
        
}


function MakeWebApiCall(apiUrl) {

    try {
        $.ajax({
            async: true,
            type: "GET",
            url: apiUrl,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            headers: {
                'Authorization': 'Bearer ' +  sessionStorage.getItem("AccessToken")
            },
            success: function (data)
            {
                return data;
            }
        });
    }
    catch (ex) { }
}

//https://localhost:7167/api/Authentication/login

document.addEventListener('DOMContentLoaded', load);