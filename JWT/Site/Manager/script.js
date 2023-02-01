function load() {
    document.getElementById('loginBtn').addEventListener('click', () =>{
        let login = document.getElementById('signInLoginInput').value;
        let password = document.getElementById('signInPasswordInput').value;
        if(login === "" || password === "")
            return;
        let user = {
            UserName: login,
            Password: password,
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
                GoToAdminPanel();
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
        let login = document.getElementById('passwordInput').value;
        let pas = document.getElementById('passwordInput').value;
        let pasAgain = document.getElementById('passwordInputAgain').value;
        let email = document.getElementById('emailInput').value;
        
        if(pas !== pasAgain || login === "" || pas === "")
            return;
        
        let user = {
            UserName: login,
            password: pas,
            email: email
        };
        try {
            $.ajax({
                type: "POST",
                url: "https://localhost:7167/api/Authentication/regManager",
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
            document.getElementById('emailInput').value = "";
            document.getElementById('signInForm').setAttribute('class', 'visible');
            document.getElementById('signUpForm').setAttribute('class', 'unVisible');
        }
        catch (ex){
            
        }
       
        
    });
}

function GoToAdminPanel() {
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
                    open('./managerPanel.html');
            }
        });
    }
    catch (ex) { }
}

document.addEventListener('DOMContentLoaded', load);