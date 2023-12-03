export const postData = async (url, data) => {
  const token = localStorage.getItem("authToken")
    try {
      const response = await fetch("http://localhost:5001/api"+url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "token": token,
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

  export const getData = async (url,data)=>{
    const token = localStorage.getItem("authToken")
    // console.log(token)
    try {
      const response = await fetch("http://localhost:5001/api"+url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "token": token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error during GET request:', error);
      throw error; // You can handle the error as needed in the calling component
    }
  }

  export const deleteData = async (url)=>{
    const token = localStorage.getItem("authToken")
    // console.log(token)
    try {
      const response = await fetch("http://localhost:5001/api"+url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "token": token,
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error during DELETE request:', error);
      throw error; 
    }
  }
  
  