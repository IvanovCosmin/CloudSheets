
var files= [
    {
        'name':'130ED5285CBC5F2D5201C7E620EE529CCBB0120710F174BDA59D2B5A52876056.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'0F3FA55F75D82CE0B4E1EB5D31D6020FFAC890609CF2818468D27166B65F65B.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'C8116B58AD555CCEC791082D16865335992B6AA59B646B44AEC95D5685A45A8F.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'ABF38843D737EF79366A73B5FB4B5715171C20980A3C2355B7A00A08B73357F9.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'0E15A4D3F9845D450755810E1A1BE9CB2D77974A4C5E513DFF719F4DE6CC67C5.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'6A42EC2FE6224BB65C74E274C2365D7559BB781677BCB79E128FCF09715E778A.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'734F962F86BCC69F9F995FA53520640EEB03EB79CEEB79A544B47BCF8A008BD2.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'DFB1A6AEE8AFEBA661285BA68FA7A77A95BCF88DB125534488E782EA669EDE1B.csht',
        'size':'100',
        'location':'acolo'
    },
    {
        'name':'4B818F20FA893F4CD193553AC922472A42E431D9DB58F0BEB6DD3C3AA8573BDF.csht',
        'size':'100',
        'location':'acolo'
    },
];


 let buildTable =() =>{
     var myDiv= document.getElementById('tableContainer');
     var html='<table ><tr id="firstRow"><th>Nr.Crt.</th><th>File name</th><th>Size</th><th>Location</th></tr>'
     for( let i=0 ; i<files.length ; i++){
        html+='<tr><th>'+(i+1)+'</th><th>'+files[i].name+'</th><th>'+files[i].size+'</th><th>'+
        files[i].location+'</th></tr>';
    }
    html=html+'</table>'
     myDiv.innerHTML=html;          
 }

 let showError =()=>{
    var mySpan=document.getElementById('errorMessage');
    mySpan.style.display='block';
    mySpan.innerHTML="Please introduce all your accounts!"
}

 let showProgressBar = async ()=> {
     document.getElementById('progressBarContainer').style.display = 'block';
     setTimeout(buildTable,1000);
}

// document.getElementById('file-input').onchange=function () {
//     console.log('Selected file: ' + this.value);
//   };

function upload () {
    driveAccount=document.getElementById('drive');
    cloudAccount=document.getElementById('cloud');
    dropboxAccount=document.getElementById('dropbox');
    if(driveAccount.value&&cloudAccount.value&&dropboxAccount.value){
    document.getElementById('errorMessage').innerHTML='';   
    document.getElementById('file-input').click();}
    else {showError();}
}
       
function showname () {
    var name = document.getElementById('file-input'); 
    console.log('Selected file: ' + name.files.item(0).name);
    console.log('Selected file: ' + name.files.item(0).size);
    
  };