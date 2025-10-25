document.getElementById("ice-cream").onsubmit = () => {

    clearErrors();

    /*
    First and last name are required
    Email address is optional. But if the user provides one, it must contain an @ symbol and a dot (.)
    Challenge:  Google how to use regular expressions in JavaScript to validate your email address
    If the user checks the mailing list checkbox, then email address is required
    LinkedIn address is optional. If one is provided, it must start with "https://linkedin.com/in/"
    "How we met" is required.

    */


    //validate first name
    let fname = document.getElementById('fname').value.trim();
    let lname = document.getElementById('lname').value.trim();
    let email = document.getElementById('email').value.trim();
    let linkedin = document.getElementById('linkedin').value.trim();
    let mail = document.getElementById('mailing-list').checked;
    let isValid = true;

    if(fname === "") {
        document.getElementById("err-fname").style.display = "block";
        isValid = false;
    }

    if(lname === "") {
        document.getElementById("err-lname").style.display = "block";
        isValid = false;
    }

    if(!email || email.indexOf("@") === -1) {
        document.getElementById("err-email").style.display = "block";
        isValid = false;
    }

    // validate cones
    let methodButton = document.getElementsByName("method");
    let count = 0;
    for(let i = 0; i < methodButton.length; i++)
    {
        if(methodButton[i].checked) {
            count++;
        }
    }
    if(count === 0) {
         document.getElementById("err-method").style.display = "block";
        isValid = false;
    }

    if(flavor === "none") {
        document.getElementById("err-flavor").style.display = "block";
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