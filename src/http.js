const apiAddress = import.meta.env.VITE_API_SERVER

export async function fetchTestData() {
  const response = await fetch(apiAddress + "/api/v1/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Test Data");
  }

  return resData.data;
}

export async function addTestData(name) {
  const response = await fetch(apiAddress + "/api/v1/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Test Data");
  }

  return resData.message;
}

export async function fetchRedisTestData() {
  const response = await fetch(apiAddress + "/api/v1/redis/test");
  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Redis Test Data");
  }

  return resData.data;
}

export async function addRedisTestData(redisName) {
  const response = await fetch(apiAddress + "/api/v1/redis/test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ redisName }),
  });

  const resData = await response.json();

  if (!response.ok) {
    throw new Error("Failed to Fetch Redis Test Data");
  }

  return resData.message;
}
