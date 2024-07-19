const request = require('request');
function getDetails() {
    return new Promise((resolve, reject) => {
        console.log('Calling tasks: https://interview.adpeai.com/api/v2/get-task' );
        request.get('https://interview.adpeai.com/api/v2/get-task', function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            try{
                const results = JSON.parse(body);
                const yearData = {};
                for (const data of results?.['transactions']) {
                    const year = data['timeStamp'].split('-')[0];
                    if (yearData[year]) {
                        yearData[year].push(data);
                    } else {
                        yearData[year] = [data];
                    }
                }
                let finalResponse = { id: results['id'], result: [] };
                if (yearData['2023']) {
                    let highest = 0;
                    let highestTrans = {};
                    for (const obj of yearData['2023']) {
                        if (obj['amount'] > highest && obj['type'] == 'alpha') {
                            highest = obj['amount'];
                            highestTrans = obj;
                        }
                    }
                    if (highestTrans['employee']) {
                        const employees = yearData['2023'].filter((obj) => {
                            if (highestTrans['employee']['id'] == obj['employee']['id'] && obj['type'] == 'alpha') {
                                finalResponse['result'].push(obj['transactionID']);
                                return obj;
                            }
                        });
                    }
                }
                resolve(finalResponse);
            }catch(E){
                // Got error while processing data;
                reject(E);
            }
        })
    });
}
function submitDetails(payload) {
    return new Promise((resolve, reject) => {
        console.log('Submitting details: https://interview.adpeai.com/api/v2/submit-task', payload );
        request.post({ url: 'https://interview.adpeai.com/api/v2/submit-task', json: payload }, function (error, response, body) {
            if (error) {
                reject(error);
                return;
            }
            console.log('final Response: ',body)
            resolve(body)
        })
    });
}
async function doLogic(req, callback) {
    try {
        const transactionDetails = await getDetails();
        const response = await submitDetails(transactionDetails);
        callback(null, response)
    } catch (E) {
        console.log(E);
        callback(E);
    }
}

module.exports = doLogic