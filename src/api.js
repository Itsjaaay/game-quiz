// const request = require("request");

// export const fetchQuestions = async (category) => {
//   const apiKey = "3c9441152bmsh1a4bced187c5293p1065d8jsn061f9aa18040";
//   const apiUrl = `https://api.api-ninjas.com/v1/trivia?category=${category}`;

//   const options = {
//     url: apiUrl,
//     headers: {
//       "X-Api-Key": apiKey,
//       "Content-Type": "application/json",
//     },
//   };

//   try {
//     const response = new Promise((resolve, reject) => {
//       request.get(options, (error, response, body) => {
//         if (error) {
//           reject(error);
//         } else {
//           console.log({ response, body });
//           resolve({ response, body });
//         }
//       });
//     });
//     console.log(response);

//     if (response.response.statusCode !== 200) {
//       throw new Error(
//         `Error: ${response.response.statusCode} - ${response.body}`
//       );
//     }

//     const data = JSON.parse(response.body);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

export const fetchQuestions = async (category) => {
  const url = `https://trivia-by-api-ninjas.p.rapidapi.com/v1/trivia?category=${category}`;
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "3c9441152bmsh1a4bced187c5293p1065d8jsn061f9aa18040",
      "X-RapidAPI-Host": "trivia-by-api-ninjas.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error(error);
  }
};
