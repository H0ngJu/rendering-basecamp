import axios from "axios";

// 함수로 만들어서 호출 시점에 환경 변수를 읽도록 수정
export function createApiClient() {
  const token = process.env.TMDB_ACCESS_TOKEN || process.env.VITE_TMDB_ACCESS_TOKEN || "";

  return axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
}

// 기본 export (하위 호환성을 위해)
export const apiClient = createApiClient();
