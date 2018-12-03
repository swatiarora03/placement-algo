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

        
      
        if(studentPriority[key] && studentPriority[key].length && !studentCompanyMapping[key]) {

            var priorityCompanies = studentPriority[key];
            // BEST CASE
            /**
             * find company with less candidates
             */
            var bestMatchedCompany = internals.bestMatchedCompany(key, priorityCompanies, companyPriority, bestMatch);
            if(bestMatchedCompany) {

                companyScore[bestMatchedCompany] = 10;
                studentScore[key] = 5;
                studentCompanyMapping[key] = bestMatchedCompany;
                bestMatch[bestMatchedCompany].push(key);
               
            } else {

                // Student preference didn't match

                studentScore[key] = 5;
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
                if(student  &&  studentPriority[student].indexOf(key) > -1 && !studentCompanyMapping[student]) {
                    // BEST CASE
                    companyScore[company] = 10;
                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student] = key ;
                } else if(student  &&  studentPriority[student].indexOf(key) === -1 &&  !studentCompanyMapping[student]){
                    // STUDENT PREF DIDN'T MATCH BUT COMPANY PREF MATCHES
                    score = 10;
                    bestMatch[key].push(student);
                    studentCompanyMapping[student] = key;
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
   for(var key in studentPriority) {

        if(!studentCompanyMapping[key]) {
       
            for(var company in companyPriority) {

                
                if(companyPriority[company].indexOf(key) > -1) {

                    studentCompanyMapping[key] = company;
                    bestMatch[company].push(key);
                    break;
                } else {

                    var leastCountCompany = internals.findCompanyWithLeastStudents(bestMatch);
                    bestMatch[leastCountCompany].push(key);
                    studentCompanyMapping[key] = leastCountCompany;

                    break;
                }
            }
        }
   }
    return bestMatch;
}

internals.findCompanyWithLeastStudents = function (bestMatch) {

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

/**
 *  
 * @param {*} key 
 * @param {*} priorityCompanies 
 * @param {*} companyPriority 
 * @param {*} bestMatch 
 */
internals.bestMatchedCompany = function (key, priorityCompanies, companyPriority, bestMatch) {

    var candidatesAlreadyAppearingInCompany = {};
    for(var i=0; i<priorityCompanies.length; i++) {
        var company = priorityCompanies[i];
        if(!bestMatch[company]) {

            bestMatch[company] =  [];
        }
        if(company && companyPriority[company].indexOf(key) > -1) {

            candidatesAlreadyAppearingInCompany[company] = bestMatch[company];
        }
    }
    if(Object.keys(candidatesAlreadyAppearingInCompany).length) {

        return internals.findCompanyWithLeastStudents(candidatesAlreadyAppearingInCompany);
    } 
    return 0;
};

/*
SAMPLE REQUEST PARAMS
Students Preferences : 
{
"s1": ["c2"],
"s2": ["c2","c1"],
"s3": ["c2","c1"],
"s4": ["c1","c2","c3","c4"],
"s5": ["c2","c1","c4","c3"],
"s6": ["c2","c3","c1","c4"],
"s7": ["c2","c1","c4","c3"],
"s8": ["c4","c2","c1","c3"]
}

Company preferences : 

{
"c1":["s3","s7"],
"c2":["s7","s8","s5","s1","s2","s3","s4","s6"],
"c3":["s2","s5","s8","s1","s3","s4","s7"],
"c4":["s2","s5","s1","s3","s8","s6","s4","s7"]
}

*/
module.exports = internals.generateScore;