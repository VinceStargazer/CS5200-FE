import { getHeaders } from '../utils/helpers';
import client from './client';

export const getAllProblems = async () => {
  try {
    const { data } = await client('/sql-problems/');
    return { data };
  } catch (error) {
    const { response } = error;
    if (response?.data) return { error: response.data };
    return { error: error.message || error };
  }
};

export const getSingleProblem = async (problem_id) => {
  try {
    const { data } = await client('/problems/' + problem_id);
    return { data };
  } catch (error) {
    const { response } = error;
    if (response?.data) return { error: response.data };
    return { error: error.message || error };
  }
};

export const submitProblemAttempt = async (
  problem_id,
  user_query,
  hints_used,
  time_taken
) => {
  try {
    const { data } = await client.post(
      '/problems/' + problem_id + '/attempt/',
      { user_query, hints_used, time_taken },
      {
        headers: getHeaders(),
      }
    );
    return { data };
  } catch (error) {
    const { response } = error;
    if (response?.data) return { error: response.data };
    return { error: error.message || error };
  }
};
