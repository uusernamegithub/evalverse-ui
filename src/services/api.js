
// API service to handle backend interactions

/**
 * Submit resume and job requirements PDFs to the backend
 * @param {File} resumeFile - The resume PDF file
 * @param {File} requirementsFile - The job requirements PDF file
 * @returns {Promise} - Promise with processing result
 */
export const submitFiles = async (resumeFile, requirementsFile) => {
  try {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('requirements', requirementsFile);
    
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload files');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting files:', error);
    throw error;
  }
};

/**
 * Fetch quiz questions from the backend
 * @returns {Promise} - Promise with question data
 */
export const fetchQuestion = async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/question', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch question');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching question:', error);
    throw error;
  }
};

/**
 * Submit quiz answer to the backend
 * @param {string} questionId - The question ID
 * @param {string} answer - The selected answer
 * @returns {Promise} - Promise with submission result
 */
export const submitAnswer = async (questionId, answer) => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('https://api.example.com/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        answer,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to submit answer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};
