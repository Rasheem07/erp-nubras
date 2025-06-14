const BASE_API_URL = "http://localhost:5005/api/v1";

export const GetRequest = async (
  path: string,
  errMsg: string = "Some error occured while fetching",
  header?: any
) => {
  const response = await fetch(`${BASE_API_URL}/${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? errMsg);
  }

  return json;
};

export const PostRequest = async (
  path: string,
  body: any,
  options?: any,
  header?: any,
  errMsg: string = "Some error occured while fetching",
) => {
  const response = await fetch(`${BASE_API_URL}/${path}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
    body: JSON.stringify(body)
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? errMsg);
  }

  return json;
};
