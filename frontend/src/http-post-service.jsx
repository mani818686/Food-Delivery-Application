const postData = async (url, data) => {
    try {
      const response = await fetch("http://localhost:5001/api"+url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error during POST request:', error);
      throw error; // You can handle the error as needed in the calling component
    }
  };
  
  export default postData;
  