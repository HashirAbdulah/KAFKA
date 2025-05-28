import { getAccessToken } from "../lib/action";

const CHAT_ENDPOINTS = {
  conversations: "/api/chat/conversations/",
  conversationDetail: (id: string) => `/api/chat/conversations/${id}/`,
  conversationMessages: (id: string) =>
    `/api/chat/conversations/${id}/messages/`,
  startConversation: (userId: string) =>
    `/api/chat/conversations/start/${userId}/`,
  editMessage: (messageId: string) => `/api/chat/messages/${messageId}/edit/`,
  deleteMessage: (messageId: string) =>
    `/api/chat/messages/${messageId}/delete/`,
  searchMessages: (conversationId: string) =>
    `/api/chat/conversations/${conversationId}/search/`,
  typingStatus: (conversationId: string) =>
    `/api/chat/conversations/${conversationId}/typing-status/`,
  uploadFile: "/api/chat/upload/",
};

const apiService = {
  get: async function (url: string): Promise<any> {
    const token = await getAccessToken();
    const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";

    return fetch(`${baseUrl}${url}`, {
      method: "GET",
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
    const isFormData = data instanceof FormData;
    return new Promise((resolve, reject) => {
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
        method: "POST",
        body: isFormData ? data : JSON.stringify(data),
        headers: {
          Accept: "application/json",
          ...(isFormData ? {} : { "Content-Type": "application/json" }),
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

  getPublic: async function (url: string): Promise<any> {
    const baseUrl = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:8000";
    return fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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

  // Chat-specific methods
  chat: {
    getConversations: async () => {
      return apiService.get(CHAT_ENDPOINTS.conversations);
    },
    getConversation: async (id: string) => {
      return apiService.get(CHAT_ENDPOINTS.conversationDetail(id));
    },
    getMessages: async (id: string, page = 1) => {
      return apiService.get(
        `${CHAT_ENDPOINTS.conversationMessages(id)}?page=${page}`
      );
    },
    startConversation: async (userId: string) => {
      return apiService.get(CHAT_ENDPOINTS.startConversation(userId));
    },
    editMessage: async (messageId: string, data: { body: string }) => {
      return apiService.put(CHAT_ENDPOINTS.editMessage(messageId), data);
    },
    deleteMessage: async (messageId: string) => {
      return apiService.delete(CHAT_ENDPOINTS.deleteMessage(messageId));
    },
    searchMessages: async (conversationId: string, query: string) => {
      return apiService.get(
        `${CHAT_ENDPOINTS.searchMessages(
          conversationId
        )}?q=${encodeURIComponent(query)}`
      );
    },
    getTypingStatus: async (conversationId: string) => {
      return apiService.get(CHAT_ENDPOINTS.typingStatus(conversationId));
    },
    uploadFile: async (formData: FormData) => {
      return apiService.post(CHAT_ENDPOINTS.uploadFile, formData);
    },
  },
};

export default apiService;
