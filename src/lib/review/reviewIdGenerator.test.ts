import { buildReviewId, formatDatePrefix } from "./reviewIdGenerator";

describe("formatDatePrefix", () => {
  it("날짜를 YYMMDD 형식으로 변환한다", () => {
    expect(formatDatePrefix(new Date(2026, 7, 24))).toBe("260824");
  });

  it("한 자리 월/일은 0으로 채운다", () => {
    expect(formatDatePrefix(new Date(2026, 0, 5))).toBe("260105");
  });
});

describe("buildReviewId", () => {
  it("날짜 prefix와 순번을 합쳐 감상평ID를 만든다", () => {
    expect(buildReviewId("260824", 1)).toBe("26082400001");
  });

  it("순번이 여러 자리여도 5자리로 0을 채운다", () => {
    expect(buildReviewId("260824", 42)).toBe("26082400042");
  });
});
