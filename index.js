

function generateScore(studentPriority, companyPriority) {

    var bestMatch = {


    };
    var studentCompanyMapping = {};
    var scoresS = {};
    var companyS = {};

    for(var key in studentPriority) {

        var scoreS1 = 0;
        if(!studentCompanyMapping[key]) {
            studentCompanyMapping[key] = [];
        }
        if(studentPriority[key] && studentPriority[key].length) {

            var priorityCompanies = studentPriority[key];
            for(var i=0; i<priorityCompanies.length; i++) {

                var company = priorityCompanies[i];
                if(!bestMatch[company]) {

                    bestMatch[company] = [];
                }
                // BEST CASE
                if(company && companyPriority[company].indexOf(key) > -1) {
                    companyS[company] = 10;
                    scoreS1 = 10;
                    studentCompanyMapping[key].push(company);
                   
                    bestMatch[company].push(key);
                } else{

                    // Student preference didn't match
                    scoreS1 = 5;
                }
            }

        }
        scoresS[key] = scoreS1;
    }
    for(var key in companyPriority) {

        var score = 0;
        if(!bestMatch[key]) {

            bestMatch[key] = [];
        }
        if(companyPriority[key] && companyPriority[key].length && companyS[key] === undefined) {

            var priorityStudents = companyPriority[key];

            for(var i=0; i<priorityStudents.length; i++) {

                var student = priorityStudents[i];
                if(!studentCompanyMapping[student]) {
                    studentCompanyMapping[student] = [];
                }
                if(student  &&  studentPriority[student].indexOf(key) > -1) {

                    companyS[company] = 10;
                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student].push(key);
                } else if(student  &&  studentPriority[student].indexOf(key) === -1 && scoresS[student] === 5){

                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student].push(key);
                } else {
                    
                    score = 5;
                }
            }
            companyS[key] = score;
        }
        
    }

    /**
     *  Student is not assigned any company
     */
   for(var key in studentCompanyMapping) {

        if(studentCompanyMapping[key] && studentCompanyMapping[key].length === 0) {

       
            for(var company in companyPriority) {

                if(bestMatch[company] === undefined) {
                    bestMatch[company] = [];
                }
                if(companyPriority[company].indexOf(key) > -1) {

                    studentCompanyMapping[key].push(company);
                    bestMatch[company].push(key);
                    break;
                } else {

                    var leastCountCompany = findCompanyWithLeastStudents(bestMatch);
                    bestMatch[leastCountCompany].push(key);
                    studentCompanyMapping[key].push(leastCountCompany);

                    break;
                }
            }
        }
   }
    //console.log(scoresS);
    //console.log(companyS);
    console.log(bestMatch);
    console.log(studentCompanyMapping);
}

function findCompanyWithLeastStudents(bestMatch) {

    var min = Object.keys(bestMatch)[0];
    var len = bestMatch[Object.keys(bestMatch)[0]].length;
    for(key in bestMatch) {
    
        if(bestMatch[key].length < len) {
            len = bestMatch[key].length;
            min = key;
        }
    }
    return min;
}
var studentPriority = {

    S1: ["C2","C3"],
    S2: ["C1"],
    S3: ["C1"],
    S4: ["C2"],
    S5: ["C1", "C2","C3"],
    S6: ["C3"]
}

var companyPriority = {

    C1: ["S1","S3","S5"],
    C2: ["S2","S6"],
    C3: ["S4","S6"]
}

generateScore(studentPriority, companyPriority);