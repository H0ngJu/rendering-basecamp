import { createApiClient } from '../lib/apiClient';
import type { MovieResponse } from '../../client/types/Movie.types';
import type { MovieDetailResponse } from '../../client/types/MovieDetail.types';

// API 클라이언트를 함수 내부에서 생성하도록 수정
export const moviesApi = {
  /**
   * 인기 영화 목록 조회
   */
  getPopular: (page: number = 1) =>
    createApiClient().get<MovieResponse>(`/movie/popular?page=${page}&language=ko-KR`),

  /**
   * 영화 상세 정보 조회
   */
  getDetail: (id: number) =>
    createApiClient().get<MovieDetailResponse>(`/movie/${id}?language=ko-KR`),
} as const;
