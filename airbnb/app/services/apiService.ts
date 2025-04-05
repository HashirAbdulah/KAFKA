const apiService = {
  get: async function (url: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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

  post: async function (url: string, data: any): Promise<any> {
    console.log("POST", url, data);
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data, // Already stringified in SignupModal
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("POST Response:", json);
          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
          method: "POST",
          body: data, // Already stringified in SignupModal
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const text = await response.text(); // Get raw text first

        if (!response.ok) {
          reject(new Error(`Server error: ${response.status} - ${text}`));
          return;
        }

        const json = JSON.parse(text); // Parse as JSON if response is OK
        console.log("Parsed JSON:", json);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
  },
};

export default apiService;
