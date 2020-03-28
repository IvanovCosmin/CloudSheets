

function changeColor(idName1, idName2) {
    document.getElementById(idName1).style.background ="#3F1842";
    document.getElementById(idName2).style.background="white"
  }

 const getStarted = `<form >
 <label for="account" class="labelTitle">Acount type</label>
<select id="account" name="account">
    <option value="google">Google</option>
    <option value="dropbox">DropBox</option>
    <option value="onedrive">One Drive</option>
  </select>


<label for="fname" class="labelTitle">First Name</label>
<input type="text" id="fname" name="firstname" placeholder="Your name..">

<label for="lname" class="labelTitle">Last Name</label>
<input type="text" id="lname" name="lastname" placeholder="Your last name..">

<label for="email" class="labelTitle">Email</label>
<input type="text" id="email" name="email" placeholder="Your email..">

<label for="password" class="labelTitle">Password</label>
<input type="password" id="passsword" name="password" >

<label for="passwordConfirm" class="labelTitle">Confirm password</label>
<input type="password" id="passwordC" name="passwordC" >




<input type="submit" value="Submit">
</form>`

const logIn=`<form >
<label for="account" class="labelTitle">Acount type</label>
<select id="account" name="account">
    <option value="google">Google</option>
    <option value="dropbox">DropBox</option>
    <option value="onedrive">One Drive</option>
  </select>

<label for="email" class="labelTitle">Email</label>
<input type="text" id="email" name="lastname" placeholder="Your email..">

<label for="password" class="labelTitle">Password</label>
<input type="password" id="password" name="password" >




<input type="submit" value="Submit">
</form>`

function openForm (idName, formContent) {
  var myDiv=document.getElementById(idName);
  var html=formContent;
  myDiv.innerHTML=html;
  console.log(html)
}