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