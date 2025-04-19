// "use server";
// import { cookies } from "next/headers";

// export async function handleLogin(
//   userId: string,
//   accessToken: string,
//   refreshToken: string
// ) {
//   const cookieStore = await cookies(); // Await the cookies to get the correct object

//   cookieStore.set("session_userid", userId, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, //One week
//     path: "/",
//   });

//   cookieStore.set("session_access_token", accessToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60, //One Hour
//     path: "/",
//   });

//   cookieStore.set("session_refresh_token", refreshToken, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, //One week
//     path: "/",
//   });
// }

// export async function handleRefresh() {
//   const cookieStore = await cookies();
//   const refreshToken = await getRefreshToken();
//   const token = await fetch("http://localhost:8000/api/auth/token/refresh/", {
//     method: "POST",
//     body: JSON.stringify({
//       refresh: refreshToken,
//     }),
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//   })
//     .then((response) => response.json())
//     .then((json) => {
//       console.log("Response - Refresh", json);
//       if (json.access) {
//         cookieStore.set("session_access_token", json.access, {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === "production",
//           maxAge: 60 * 60, // To expire the cookie hourly
//           path: "/",
//         });
//         return json.access;
//       } else {
//         resetAuthCookies();
//       }
//     })
//     .catch((error)=> {
//       console.log('error', error)
//       resetAuthCookies();
//     })
//     return token;
// }

// export async function resetAuthCookies() {
//   const cookieStore = await cookies(); // Await the cookies to get the correct object

//   cookieStore.set("session_userid", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, // To expire the cookie weekly
//     path: "/",
//   });

//   cookieStore.set("session_access_token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60, // To expire the cookie hourly
//     path: "/",
//   });

//   cookieStore.set("session_refresh_token", "", {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 60 * 60 * 24 * 7, // To expire the cookie weekly
//     path: "/",
//   });
// }

// export async function getUserId() {
//   const cookieStore = await cookies(); // Await the cookies to get the correct object
//   const userId = cookieStore.get("session_userid")?.value;
//   return userId ? userId : null;
// }

// export async function getAccessToken() {
//   const cookieStore = await cookies(); // Await the cookies to get the correct object
//   let accessToken = cookieStore.get("session_access_token")?.value;
//   if (!accessToken){
//     accessToken = await handleRefresh();
//   }
//   return accessToken;
// }

// export async function getRefreshToken() {
//   const cookieStore = await cookies(); // Await the cookies to get the correct object
//   const refreshToken = cookieStore.get("session_refresh_token")?.value;
//   return refreshToken;
// }
"use server";
import { cookies } from "next/headers";

// Function to handle user login and set cookies
export async function handleLogin(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();

  cookieStore.set("session_userid", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });

  cookieStore.set("session_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // One hour
    path: "/",
  });

  cookieStore.set("session_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // One week
    path: "/",
  });
}

// Function to handle token refresh
export async function handleRefresh() {
  const cookieStore = await cookies();
  const refreshToken = await getRefreshToken();

  try {
    const response = await fetch("http://localhost:8000/api/auth/token/refresh/", {
      method: "POST",
      body: JSON.stringify({ refresh: refreshToken }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    console.log("Response - Refresh", json);

    if (json.access) {
      cookieStore.set("session_access_token", json.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60, // One hour
        path: "/",
      });
      return json.access;
    } else {
      await resetAuthCookies();
      return null;
    }
  } catch (error) {
    console.log("Error refreshing token", error);
    await resetAuthCookies();
    return null;
  }
}

// Function to reset authentication cookies
export async function resetAuthCookies() {
  const cookieStore = await cookies();

  cookieStore.set("session_userid", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  cookieStore.set("session_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  cookieStore.set("session_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0, // Expire immediately
    path: "/",
  });
}

// Function to get user ID from cookies
export async function getUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get("session_userid")?.value;
  return userId ?? null;
}

// Function to get access token from cookies
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("session_access_token")?.value;
  if (!accessToken) {
    accessToken = await handleRefresh();
  }
  return accessToken ?? null;
}

// Function to get refresh token from cookies
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("session_refresh_token")?.value;
  return refreshToken ?? null;
}
