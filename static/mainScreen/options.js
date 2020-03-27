var myJSON = {
    "options": [

        {
            "class" : "log-option",
            "title" : "Dropbox",
            "id" : "drop-box",
            "titleClass" : "log-option-title",
            "src" : "../assets/black_cloud.svg"
        } ,

        {
            "class" : "log-option",
            "title" : "Google",
            "id" : "google",
            "titleClass" : "log-option-title",
            "src" : "../assets/black_cloud.svg"


        } ,
        {
            "class" : "log-option",
            "title" : "One Drive",
            "id" : "one- drive",
            "titleClass" : "log-option-title",
            "src" : "../assets/black_cloud.svg"


        } ]}

        function showForm () {
            var myDiv=document.getElementById("form");
            var html=`<form class="w3-container">
           <label>First Name</label>
            <input class="w3-input" type="text">
            
            <label>Last Name</label>
            <input class="w3-input" type="text">
            
            </form>`

            myDiv.innerHTML=html;
        }

        function createFig (obj) {
            var fig="";
            fig +='<div class="' + obj.class + '" > <button class="option-btn">';
            fig += '<img src="' + obj.src + '" alt = "' + obj.title + '" />'
            fig +='<span class="' +obj.titleClass+ '" >' + obj.title + '</span>';
            fig+=" </button></div>";
            return fig;
       }

       document.addEventListener("DOMContentLoaded", function(){
        var myDiv=document.getElementById("options");
        var html="";
    //    var a= window.location.href.split('/');
    //    var aux=a[a.length-1].split('.')[0];
       
           for( let i=0 ; i<myJSON.options.length ; i++){
               html+=createFig(myJSON.options[i]);
               console.log(createFig(myJSON.options[i]))
           }
       
        myDiv.innerHTML=html;
   })
       