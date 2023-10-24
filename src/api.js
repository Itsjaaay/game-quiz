
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
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
  }
};
