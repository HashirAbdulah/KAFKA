import { getAccessToken } from "../lib/action";
const apiService = {
  get: async function (url: string): Promise<any> {
    const token = await getAccessToken();
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          // console.log("Response:", json);

          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  post: async function (url: string, data: any): Promise<any> {
    const token = await getAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";

    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("Response:", json);
        return json;
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        throw error;
      });
  },

  put: async function (url: string, data: any): Promise<any> {
    const token = await getAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";

    const isFormData = data instanceof FormData;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${token}`,
    };

    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    return fetch(`${baseUrl}${url}`, {
      method: "PUT",
      headers,
      body: isFormData ? data : JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("Response:", json);
        return json;
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        throw error;
      });
  },

  delete: async function (url: string): Promise<any> {
    const token = await getAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";

    return fetch(`${baseUrl}${url}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((json) => {
        console.log("Response:", json);
        return json;
      })
      .catch((error) => {
        console.error("Fetch Error:", error);
        throw error;
      });
  },

  postWithoutToken: async function (url: string, data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log("Response:", json);

          resolve(json);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};

export default apiService;
