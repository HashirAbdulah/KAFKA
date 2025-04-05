const apiService = {
  get: async function (url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`, // Add token
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("GET Response:", json);
          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  post: async function (url: string, data: FormData): Promise<any> {
    const token = localStorage.getItem("session_access_token") || "";
    console.log("POST", url, data, "Token:", token);
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
         ...(token && { Authorization: `Bearer ${token}` }), // Add token
          // Do NOT set Content-Type for FormData; browser sets it with boundary
        },
        body: data, // Pass FormData directly
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(`Server error: ${response.status} - ${JSON.stringify(err)}`);
            });
          }
          return response.json();
        })
        .then((json) => {
          console.log("POST Response:", json);
          resolve(json);
        })
        .catch((error) => {
          console.error("POST Error:", error);
          reject(error);
        });
    });
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
          method: "POST",
          body: data,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const text = await response.text();
        if (!response.ok) {
          reject(new Error(`Server error: ${response.status} - ${text}`));
          return;
        }

        const json = JSON.parse(text);
        console.log("Parsed JSON:", json);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default apiService;
