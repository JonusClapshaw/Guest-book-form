document.getElementById("guest-book").onsubmit = () => {

    clearErrors();

    //validate first name
    let fname = document.getElementById('fname').value.trim();
    let lname = document.getElementById('lname').value.trim();
    let email = document.getElementById('email').value.trim();
    let linkedin = document.getElementById('linkedin').value.trim();
    let mail = document.getElementById('mail').value;

    let isValid = true; 

    if(fname === "") {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    if(lname === "") {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    if(!linkedin.startsWith("https://linkedin.com/in/")) {
        document.getElementById("err-linkedin").style.display = "block";
        isValid = false;
    }

    if(!email || email.indexOf("@") === -1 && email.indexOf(".") === -1) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    if(!mail){
        document.getElementById("err-mail").style.display = "block";
        isValid = false;
    }
    return isValid;
}

function clearErrors(){
    let errors = document.getElementsByClassName("error");
    for(let i = 0; i < errors.length; i++)
    {
        errors[i].style.display = "none";
    }
}

