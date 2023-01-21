function load() {
    document.getElementById('loginBtn').addEventListener('click', () =>{
        let user = {
            Id: 0,
            Login: document.getElementById('signInLoginInput').value,
            Password: document.getElementById('signInPasswordInput').value,
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
                if(data.token != null){
                    sessionStorage.setItem('AccessToken', data.token);
                    GoToProductsPage();
                }
                
            }

        });
    });
    document.getElementById('goToSignUpBtn').addEventListener('click', () =>{
        document.getElementById('signInForm').setAttribute('class', 'unVisible');
        document.getElementById('signUpForm').setAttribute('class', 'visible');
    });
    document.getElementById('goToSignInBtn').addEventListener('click', () => {
        document.getElementById('signInForm').setAttribute('class', 'visible');
        document.getElementById('signUpForm').setAttribute('class', 'unVisible');
    });
    document.getElementById('signUpBtn').addEventListener('click', () => {
        let pas = document.getElementById('passwordInput').value;
        let pasAgain = document.getElementById('passwordInputAgain').value;
        
        if(pas !== pasAgain)
            return;
        
        let user = {
            id: 0,
            login: document.getElementById('loginInput').value,
            password: pas
        };
        try {
            $.ajax({
                type: "POST",
                url: "https://localhost:7167/api/Users/AddUser",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(user),
                success: function (data)
                {

                }
            });
            document.getElementById('passwordInput').value = "";
            document.getElementById('passwordInputAgain').value = "";
            document.getElementById('loginInput').value = "";
            document.getElementById('signInForm').setAttribute('class', 'visible');
            document.getElementById('signUpForm').setAttribute('class', 'unVisible');
        }
        catch (ex){
            
        }
       
        
    });
}


function GoToCategoryPage() {
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
                if(data != null)
                    open('./CategoryPage.html');
            }
        });
    }
    catch (ex) { }
}
function GoToProductsPage() {
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
                if(data != null)
                    open('./ProductsPage.html');
            }
        });
    }
    catch (ex) { }
}

document.addEventListener('DOMContentLoaded', load);