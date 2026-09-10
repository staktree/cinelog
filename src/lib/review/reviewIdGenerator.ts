/**
 * 감상평ID 포맷팅 로직
 * 형식: YYMMDD00001 (생성일자 6자리 + 5자리 순번)
 * 순번 자체는 동시 요청에도 중복되지 않도록 Supabase DB(next_review_sequence 함수)에서
 * 원자적으로 발번한다. 이 파일은 그 결과를 조합/포맷하는 순수 로직만 담당한다.
 * 참고: SDD/감상평작성기능명세.md 4~6번
 */

export const REVIEW_ID_SEQUENCE_LENGTH = 5;

/** 날짜를 감상평ID의 날짜 부분(YYMMDD)으로 변환한다 */
export function formatDatePrefix(date: Date): string {
  const year = String(date.getFullYear()).slice(2, 4);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}${month}${day}`;
}

/** 날짜 prefix와 DB에서 발번된 순번을 합쳐 감상평ID를 만든다 */
export function buildReviewId(datePrefix: string, sequence: number): string {
  const sequenceText = String(sequence).padStart(REVIEW_ID_SEQUENCE_LENGTH, "0");
  return `${datePrefix}${sequenceText}`;
}
