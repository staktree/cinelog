import { listReviewsAction } from "@/app/actions/reviewActions";
import ReviewBrowser from "@/components/review/ReviewBrowser";

// 감상평 데이터가 파일시스템에 실시간으로 쌓이므로, 정적 캐싱 없이 매 요청마다 새로 조회한다
export const dynamic = "force-dynamic";

/** 감상평 조회 화면 (초기 접속 시 Default로 오픈되는 메인화면) */
export default async function HomePage() {
  const initialResult = await listReviewsAction();

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <ReviewBrowser initialResult={initialResult} />
    </div>
  );
}
