'use strict';

var internals = {};

internals.parseJson = function (obj, ref) {

    try {
        console.log($("#studentPreference").value);
        console.log(typeof $("#studentPreference").value);
        return JSON.parse(obj);
    }
    catch(e) {

        alert('Invalid JSON Exception in '+ ref);
        console.log(e);
        return {};
    }
}

internals.init = function () {

$("#buttonSubmit").click(internals.postData);

};

internals.postData = function(e) {

       
        $.post("/calculate/bestmatch",
        {
         "student": $("#studentPreference").val(),
         "company": $("#companyPreference").val()
        },
        function(data, status){
            
            if(data) {
                $("#bestMatch").val(JSON.stringify(data));
            }
        });
    
}
internals.init();