"use server";
import { cookies } from "next/headers";

export async function handleLogin(
  userId: string,
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();  // Await the cookies to get the correct object

  cookieStore.set("session_userid", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, //One week
    path: "/",
  });

  cookieStore.set("session_access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, //One Hour
    path: "/",
  });

  cookieStore.set("session_refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, //One week
    path: "/",
  });
}

export async function resetAuthCookies() {
  const cookieStore = await cookies();  // Await the cookies to get the correct object

  cookieStore.set("session_userid", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // To expire the cookie immediately
    path: "/",
  });

  cookieStore.set("session_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // To expire the cookie immediately
    path: "/",
  });

  cookieStore.set("session_refresh_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: -1, // To expire the cookie immediately
    path: "/",
  });
}

export async function getUserId() {
  const cookieStore = await cookies();  // Await the cookies to get the correct object
  const userId = cookieStore.get("session_userid")?.value;
  return userId ? userId : null;
}

export async function getAccessToken() {
  const cookieStore = await cookies();  // Await the cookies to get the correct object
  const accessToken = cookieStore.get("session_access_token")?.value;
  return accessToken;
}
