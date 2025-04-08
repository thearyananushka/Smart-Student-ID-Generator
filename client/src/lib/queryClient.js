import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const body = await res.text();
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch (e) {
      // If we can't parse the body, just throw with the status
      throw new Error(`Request failed with status ${res.status}`);
    }

    if (parsed.message) {
      throw new Error(parsed.message);
    }
    throw new Error(`Request failed with status ${res.status}`);
  }
}

export async function apiRequest(
  path,
  { body, headers, method = "GET", credentials = "include" } = {}
) {
  const res = await fetch(path, {
    method,
    credentials,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  await throwIfResNotOk(res);

  // Handle 204 No Content
  if (res.status === 204) {
    return null;
  }

  return res.json();
}

export const getQueryFn = (options) => {
  return async ({ queryKey }) => {
    try {
      const path = Array.isArray(queryKey[0]) ? queryKey[0][0] : queryKey[0];
      return await apiRequest(path);
    } catch (err) {
      if (err.message.includes("401") && options.on401 === "returnNull") {
        return null;
      }
      throw err;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
      queryFn: getQueryFn({ on401: "throw" }),
    },
  },
});