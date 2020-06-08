function changeColor(idName1, idName2) {
  document.getElementById(idName1).style.background = "#0BD54F";
  document.getElementById(idName2).style.background = "#000514";
}

const getStarted = `<form onsubmit="submitBtn('email')" action="/welcomePage/onRegister" method="POST" >

<label for="name" class="labelTitle">Name:</label>
<input type="text" name="name" id="fname" placeholder="Your first name.." minlength="3" maxlength="12"
       pattern="[a-zA-Z][a-zA-Z_]*[a-zA-Z]"
       title="The name must contain only letters."
       required> 

<label for="surname" class="labelTitle">Surname:</label>
<input type="text" name="surname" id="lname" placeholder="Your last name.." minlength="3" maxlength="12"
       pattern="[a-zA-Z][a-zA-Z_]*[a-zA-Z]"
       title="The surname must contain only letters."
       required> 


<label for="email" class="labelTitle" >Email address:</label>
<input type="text" name="email" id="email" placeholder="Enter your email.." minlength="5" maxlength="90"
       pattern="^[a-zA-Z0-9.!#$%&'*+/=?^_{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
       title="Please enter a valid email address."
       required>

<label for="password" class="labelTitle" >Choose a password:</label>
<input type="password" name="password" id="password" placeholder="Enter your password.." minlength="7" maxlength="30" 
       pattern=^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$
       title="Please include at least 1 uppercase character, 1 lowercase character, and 1 number." 
       required>

<label for="cpassword" class="labelTitle">Confirm your password:</label>
<input type="password" name="cpassword" id="passwordC" placeholder="Enter your password.." minlength="7" maxlength="30" 
       pattern=^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$
       title="Please include at least 1 uppercase character, 1 lowercase character, and 1 number." 
       required>

       <input type="submit"  id="submitBtn" value="Submit">
</form>
`;

const logIn=`<form onsubmit="submitBtn('email')" action="/welcomePage/onLogin" method="POST" >


<label class = "labelTitle" for="email">Email:</label>
<input type="text" name="email" id="email" placeHolder="Enter your email.." required > 

<label class = "labelTitle" for="password">Password:</label>
<input type="password" name="password" id="password" placeHolder="Enter your password.." required>

<input type="submit"  id="submitBtn1" value="Submit">
</form>
`;

function submitBtn(id) {
  console.log("heeelllpppp");
  window.localStorage.setItem("email", document.getElementById(id).value);

}


function openForm(idName, formContent) {
  var myDiv = document.getElementById(idName);
  var html = formContent;
  myDiv.innerHTML = html;
}

{/* <label for="account" class="labelTitle">Acount type</label>
<select id="account" name="account">
    <option value="google">Google</option>
    <option value="dropbox">DropBox</option>
    <option value="onedrive">One Drive</option>
  </select> */}