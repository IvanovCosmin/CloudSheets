let assert = require("assert");
let utils = require("../router-utils");
let fs = require('fs');

context('(prepareServita)for a .html that has no {{ }} ',function(){
    it('should return an existing object',function(){
        const content =fs.readFileSync("templates/welcome-page.html");
        const da = utils.servita(content,{});
        assert.ok(da != undefined);
    });
    it('should return same page',function(){
        const content =fs.readFileSync("templates/welcome-page.html");
        const da = utils.servita(content,{});
        assert.ok(da == content);
    });
})


context('(prepareServita)for a .html that has {{ }}',function(){
    it('should return an existing object',function(){
        const content =fs.readFileSync("templates/settings-page.html");
        const da = utils.servita(content,{});
        assert.ok(da != undefined);
    });
    it('should not return the same page',function(){
        const content =fs.readFileSync("templates/settings-page.html");
        const da = utils.servita(content,{});
        assert.ok(da != content);
    });
})

/*------WebKitFormBoundaryWABSTABhUZf2QuD7
Content-Disposition: form-data; name="fileName"

H5_Game.exe
------WebKitFormBoundaryWABSTABhUZf2QuD7
Content-Disposition: form-data; name="size"

13089792
------WebKitFormBoundaryWABSTABhUZf2QuD7
Content-Disposition: form-data; name="files"

9459D988EB97A9997CB7BF887280813973292380C5BA2C46D8C974FAFD84F2F6.csht,AB7672C8820351B24F585B711A885436790F9BC22C1C467E629BE50A6546A0A6.csht,EC0F60E278F06CFE181E17CBBDCE4AFEE4946353894DE3BEF18EC0283DF09087.csht,F2FB058E53EE7D921BD10C8B18115A3FD0B918DC1D05E7A8DF3D0CB1BDA76776.csht,DEBA638F99BE54C69A96A5C966021494013ED3641979F2961FEC5FE94BE43863.csht,9DF58FB5D718653A31780B5C9626E433D9D07A8CF2B87EE10FAEE3EBBDCBF493.csht,224EA02EB9B2D9F14148841E458E1C21C2F38B3D05A1D7D30302AD9AE919A888.csht,CE8C67D069FC07EB440D39DAE346F7200FD7BF276DF6C1CB922E582A9354AD58.csht,FB43C63E7666B9D478992823522B842180C3897A4911A76DB19E341EAD50A4CE.csht,03180DA1B2BED3D5F0FBF6660E84E76105825BD5BD9F95837F2DF7A6B1559F96.csht,1DB33057F05892C733E1B3D23E4DE0021796679F1C74D2DA7D54210D0F4661D3.csht,D800D775A69E5B1F483C878AA52A519AC19D285A349A04208133D23F962DEA54.csht,105641C5F3C41E1A53D67D73A8739AA31DE82DD07471D35BD91F1DAE4E8370D7.csht,90D19B1999FA44832501B10FC1F1C204CB465AE215B1960CC266C6BAC3147364.csht
------WebKitFormBoundaryWABSTABhUZf2QuD7
Content-Disposition: form-data; name="email"

cosminivanov@gmail.com
------WebKitFormBoundaryWABSTABhUZf2QuD7--

 */

context('(parseBodyFormData)',function(){
    const reqBody=`------WebKitFormBoundaryWABSTABhUZf2QuD7
        Content-Disposition: form-data; name="fileName"
        
        H5_Game.exe
        ------WebKitFormBoundaryWABSTABhUZf2QuD7
        Content-Disposition: form-data; name="size"
        
        13089792
        ------WebKitFormBoundaryWABSTABhUZf2QuD7
        Content-Disposition: form-data; name="files"
        
        9459D988EB97A9997CB7BF887280813973292380C5BA2C46D8C974FAFD84F2F6.csht,AB7672C8820351B24F585B711A885436790F9BC22C1C467E629BE50A6546A0A6.csht,EC0F60E278F06CFE181E17CBBDCE4AFEE4946353894DE3BEF18EC0283DF09087.csht,F2FB058E53EE7D921BD10C8B18115A3FD0B918DC1D05E7A8DF3D0CB1BDA76776.csht,DEBA638F99BE54C69A96A5C966021494013ED3641979F2961FEC5FE94BE43863.csht,9DF58FB5D718653A31780B5C9626E433D9D07A8CF2B87EE10FAEE3EBBDCBF493.csht,224EA02EB9B2D9F14148841E458E1C21C2F38B3D05A1D7D30302AD9AE919A888.csht,CE8C67D069FC07EB440D39DAE346F7200FD7BF276DF6C1CB922E582A9354AD58.csht,FB43C63E7666B9D478992823522B842180C3897A4911A76DB19E341EAD50A4CE.csht,03180DA1B2BED3D5F0FBF6660E84E76105825BD5BD9F95837F2DF7A6B1559F96.csht,1DB33057F05892C733E1B3D23E4DE0021796679F1C74D2DA7D54210D0F4661D3.csht,D800D775A69E5B1F483C878AA52A519AC19D285A349A04208133D23F962DEA54.csht,105641C5F3C41E1A53D67D73A8739AA31DE82DD07471D35BD91F1DAE4E8370D7.csht,90D19B1999FA44832501B10FC1F1C204CB465AE215B1960CC266C6BAC3147364.csht
        ------WebKitFormBoundaryWABSTABhUZf2QuD7
        Content-Disposition: form-data; name="email"
        
        cosminivanov@gmail.com
        ------WebKitFormBoundaryWABSTABhUZf2QuD7--`;
    let preparedBody = "";
    for(let letter of reqBody) {
        if(letter == "\n") {
            preparedBody += "\r\n";
        }
        else {
            preparedBody += letter;
        }
    }
    

    it('sould return an existing object',function(){
        da=utils.parseBodyFormData(preparedBody);
        assert.ok(da!=undefined);
    });
    it('should be',function () {
        da=utils.parseBodyFormData(preparedBody);
       assert.ok(da.fileName == "        H5_Game.exe" && da.size== "        13089792" && da.email == "        cosminivanov@gmail.com");
    });
});