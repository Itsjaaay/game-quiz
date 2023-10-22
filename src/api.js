const request = require('request');

export const fetchQuestions = (category) => {
  const apiKey = '7b9e4990f3mshadeff47f0a99ad0p188b5ajsn09e11d40cf07'; 
  const apiUrl = `https://api.api-ninjas.com/v1/trivia?category=${category}`;

  return new Promise((resolve, reject) => {
    request.get({
      url: apiUrl,
      headers: {
        'X-Api-Key': apiKey
      }
    }, (error, response, body) => {
      if (error) {
        reject(error);
      } else if (response.statusCode !== 200) {
        reject(new Error(`Error: ${response.statusCode} - ${body.toString('utf8')}`));
      } else {
        try {
          const data = JSON.parse(body);
          resolve(data);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
};
