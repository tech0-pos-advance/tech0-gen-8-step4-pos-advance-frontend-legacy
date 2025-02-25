"use server"

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// コンポーネントのアンマウント時に fetch をキャンセルするための AbortController
const controller = new AbortController();

async function fetchUser(user_token) {
    const res = await fetch(`${apiUrl}/user_search/?token=${user_token}`, {
        cache: "no-cache",
        signal: controller.signal,
    });
    if (!res.ok) {
    throw new Error('Failed to fetch user');
    }
    return res.json();
}
