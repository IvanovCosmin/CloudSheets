
 form = document.getElementById("form");
 username = document.getElementById("username");
 email = document.getElementById("email");
 password = document.getElementById("password");
 cpassword = document.getElementById("second_password");

 function checkInputs(){
    
}

form.addEventListener('submit',(e)=>{

    e.preventDefault();
    
    if(cpassword.value !== password.value){
        
    }
    else{
       e.currentTarget.submit();
       //window.location.href=`https://localhost:8000/text-input/homepage`
    }
});