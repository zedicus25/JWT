function load() {
    document.getElementById('loginBtn').addEventListener('click', () =>{

        let user = {
            Id: 0,
            Login: document.getElementById('loginInput').value,
            Password: document.getElementById('passwordInput').value,
        };
        
        $.ajax({

            type: "POST",

            url: "https://localhost:7167/api/Authentication/login",

            data: JSON.stringify(user),

            headers: {

                'Accept': 'application/json',

                'Content-Type': 'application/json'

            },

            success: function(data) {
                console.log(data.token);
                sessionStorage.setItem('AccessToken', data.token);
                MakeWebApiCall();
            }

        });
    });
}


function MakeWebApiCall() {

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
                open('./CategoryPage.html');
            }
        });
    }
    catch (ex) { }
}

//https://localhost:7167/api/Authentication/login

document.addEventListener('DOMContentLoaded', load);