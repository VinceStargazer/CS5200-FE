export const trim = (string, limit = 100) => {
  if (string.length <= limit) return string;
  return string.substring(0, limit) + '...';
};

export const isValidEmail = (email) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
};

export const getHeaders = () => {
  const token = localStorage.getItem('access-token');
  return {
    authorization: 'Bearer ' + token,
    'content-type': 'application/json',
  };
};

export const validateUser = (name, email, password, confirmedPassword) => {
  const nameRegex = /^[a-z A-Z]+$/;
  if (!name.trim()) return { ok: false, error: 'Name is missing!' };
  if (!nameRegex.test(name)) return { ok: false, error: 'Invalid name!' };
  if (!email.trim()) return { ok: false, error: 'Email is missing!' };
  if (!isValidEmail(email)) return { ok: false, error: 'Invalid email!' };
  if (!password.trim()) return { ok: false, error: 'Password is missing!' };
  if (password.length < 8)
    return { ok: false, error: 'Password must be at least 8 characters!' };
  if (password !== confirmedPassword)
    return { ok: false, error: "Passwords don't match!" };
  return { ok: true };
};

export const generatePromptFromProblem = (problem, hintResponses, hintStep) => {
  const { description, topic, tables, expected_output } = problem;
  let prompt = `The current problem is: ${description}. The table format is: ${JSON.stringify(
    tables
  )}. The topic is: ${topic}. The expected output is: ${expected_output}`;
  prompt += `Here are previous hints: ${JSON.stringify(hintResponses)}. `;
  if (hintStep < 2)
    prompt +=
      'Now give your next hint. Try not to repeat. Build your next hint upon them. Limit your answer within 30 words';
  else prompt += 'Now give your MySQL solution to this problem. Only reply with the solution';
  return prompt;
};
