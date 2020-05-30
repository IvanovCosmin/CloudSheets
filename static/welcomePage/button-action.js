

function changeColor(idName1, idName2) {
  document.getElementById(idName1).style.background = "#0BD54F";
  document.getElementById(idName2).style.background = "#000514";
}

const getStarted = `<form >

<label for="fname" class="labelTitle">First Name</label>
<input type="text" id="fname" name="firstname" placeholder="Your first name..">

<label for="lname" class="labelTitle">Last Name</label>
<input type="text" id="lname" name="lastname" placeholder="Your last name..">

<label for="email" class="labelTitle">Email</label>
<input type="text" id="email" name="email" placeholder="Your email..">

<label for="password" class="labelTitle">Password</label>
<input type="password" id="passsword" name="password" >

<label for="passwordConfirm" class="labelTitle">Confirm password</label>
<input type="password" id="passwordC" name="passwordC" >


</form>
<input type="submit" onclick="submitBtn()" id="submitBtn" value="Submit">`;

const logIn = `<form >


<label for="email" class="labelTitle">Email</label>
<input type="text" id="email" name="lastname" placeholder="Your email..">

<label for="password" class="labelTitle">Password</label>
<input type="password" id="password" name="password" >

</form>
<input type="submit" onclick="submitBtn()" id="submitBtn1" value="Submit">`;

function submitBtn() {
  // document.getElementById("submitBtn1").onclick = function () {
  console.log("heeelllpppp");
  location.href = "../mainScreen/index.html";
  // };

}


function openForm(idName, formContent) {
  var myDiv = document.getElementById(idName);
  var html = formContent;
  myDiv.innerHTML = html;
  console.log(html)
}

{/* <label for="account" class="labelTitle">Acount type</label>
<select id="account" name="account">
    <option value="google">Google</option>
    <option value="dropbox">DropBox</option>
    <option value="onedrive">One Drive</option>
  </select> */}