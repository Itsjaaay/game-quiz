// src/api.js
import axios from 'axios';

const API_URL = 'https://the-trivia-api.com/v2/questions';

export const fetchQuestions = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};