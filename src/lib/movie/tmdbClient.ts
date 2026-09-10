import { ExternalApiError } from "@/lib/errors/ExternalApiError";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

/** 환경변수(TMDB_API_KEY)에 설정된 TMDB API 인증키를 가져온다. 없으면 ExternalApiError를 던진다 */
function getApiKey(): string {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new ExternalApiError("TMDB_API_KEY가 설정되지 않았습니다. .env.local을 확인해주세요.");
  }
  return apiKey;
}

/** TMDB API를 호출하여 JSON 응답을 반환한다. 실패 시 ExternalApiError를 던진다 */
export async function fetchFromTmdb<T>(
  path: string,
  searchParams: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", getApiKey());
  for (const [key, value] of Object.entries(searchParams)) {
    url.searchParams.set(key, value);
  }

  let response: Response;
  try {
    response = await fetch(url.toString());
  } catch {
    throw new ExternalApiError("TMDB API 호출 중 네트워크 오류가 발생했습니다.");
  }

  if (!response.ok) {
    throw new ExternalApiError(`TMDB API 호출에 실패했습니다. (status: ${response.status})`);
  }

  return (await response.json()) as T;
}

/** TMDB 이미지 경로를 지정된 크기의 전체 URL로 변환한다. 경로가 없으면 null을 반환한다 */
export function toTmdbImageUrl(path: string | null | undefined, size: string): string | null {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
