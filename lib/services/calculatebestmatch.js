'use strict';

const internals = {};
internals.parseJson = function (obj, ref) {

    try {
      
        return JSON.parse(obj);
    }
    catch(e) {

        console.log(e);
        return {};
    }
}

/**
 * 
 * @param {conatins student & company priority object} params 
 */
internals.generateScore = function(params) {

    
    var studentPriority = internals.parseJson(params.student);
    var companyPriority = internals.parseJson(params.company);
    var bestMatch = {};
    var studentCompanyMapping = {};
    var studentScore = {};
    var companyScore = {};

    /**
     * Loop over student priority list
     */
    for(var key in studentPriority) {

       
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
                    companyScore[company] = 10;
                    studentScore[key] = 5;
                    studentCompanyMapping[key].push(company);
                   
                    bestMatch[company].push(key);
                } else{

                    // Student preference didn't match
                    studentScore[key] = 5;
                }
            }

        }
        
    }
    /**
     *  Loop over company priority list
     */
    for(var key in companyPriority) {

        var score = 0;
        if(!bestMatch[key]) {

            bestMatch[key] = [];
        }
        if(companyPriority[key] && companyPriority[key].length && companyScore[key] === undefined) {

            var priorityStudents = companyPriority[key];

            for(var i=0; i<priorityStudents.length; i++) {

                var student = priorityStudents[i];
                if(!studentCompanyMapping[student]) {
                    studentCompanyMapping[student] = [];
                }
                if(student  &&  studentPriority[student].indexOf(key) > -1) {
                    // BEST CASE
                    companyScore[company] = 10;
                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student].push(key);
                } else if(student  &&  studentPriority[student].indexOf(key) === -1 && studentScore[student] === 5){
                    // STUDENT PREF DIDN'T MATCH BUT COMPANY PREF MATCHES
                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student].push(key);
                } else {
                    // IF BOTH STUDENT & COMPANY PREF DON'T MATCH
                    score = 5;
                }
            }
            companyScore[key] = score;
        }
        
    }

    /**
     *  When Student is not assigned to any company
     */
   for(var key in studentCompanyMapping) {

        if(studentCompanyMapping[key] && studentCompanyMapping[key].length === 0) {

       
            for(var company in companyPriority) {

                
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
   
    return bestMatch;
}

function findCompanyWithLeastStudents(bestMatch) {

    var min = Object.keys(bestMatch)[0];
    var len = bestMatch[Object.keys(bestMatch)[0]].length;
    for(var key in bestMatch) {
    
        if(bestMatch[key].length < len) {
            len = bestMatch[key].length;
            min = key;
        }
    }
    return min;
}

/*
SAMPLE REQUEST PARAMS
var studentPriority = {

    "S1": ["C2","C3"],
    "S2": ["C1"],
    "S3": ["C1"],
    "S4": ["C2"],
    "S5": ["C1", "C2","C3"],
    "S6": ["C3"]
}

var companyPriority = {

    "C1": ["S1","S3","S5"],
    "C2": ["S2","S6"],
    "C3": ["S4","S6"]
}
*/
module.exports = internals.generateScore;