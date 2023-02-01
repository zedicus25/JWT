function load() {
    loadCategories();
    $('#goToSignUpBtn').click( () => {
        $("#signInForm").attr('class','unVisible');
        $("#signUpForm").attr('class','visible');
    });
    $('#goToSignInBtn').click( () => {
        $("#signInForm").attr('class','visible');
        $("#signUpForm").attr('class','unVisible');
    });
    $('#backBtnLogin').click(() => {
        $("#signInForm").attr('class','unVisible');
        $('#popularCardsContainer').attr('class', 'flexBox flexBox-horizontal visible');
    });
    $('#backBtnReg').click(() => {
        $("#signUpForm").attr('class','unVisible');
        $('#popularCardsContainer').attr('class', 'flexBox flexBox-horizontal visible');
    });
    $('#loginBtn').click(login);
    $('#signUpBtn').click(registration);
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
                open('./producPage.html');
            });
            div.innerText = p.name;
            parent.append(div);
        });
        createAuthButtons(parent);
        }
    });
}

function createAuthButtons (parentNode) {  
    let loginBtn = document.createElement('input');
    loginBtn.setAttribute('type','button');
    loginBtn.setAttribute('class','btn btn-link');
    loginBtn.addEventListener('click', () => {
        $('#popularCardsContainer').attr('class', 'flexBox flexBox-horizontal unVisible');
        $('#signInForm').attr('class','visible');
    });
    loginBtn.setAttribute('value','Login');
    parentNode.append(loginBtn);
}

function login(){
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
            $("#signInForm").attr('class','unVisible');
        }      
        }
    });
}

function registration(){
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
            url: "https://localhost:7167/api/Authentication/regUser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(user),
            success: function (data)
            {
                if(data != null){
                    $("#signInForm").attr('class','visible');
                    $("#signUpForm").attr('class','unVisible');
                }
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
}
document.addEventListener('DOMContentLoaded', load);