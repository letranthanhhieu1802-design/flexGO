/**
 * Chuẩn hóa cấu trúc Mã Lead / Inquiry xuyên suốt hệ thống FlexGO:
 * Cấu trúc: FG-YYMMDDXXXX (tăng dần trong ngày từ 0001, tự động mở rộng khi >= 10000)
 * Ví dụ: FG-2608310001
 */
export function generateFlexGOCode(date: Date = new Date(), sequenceNumber: number = 1): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  const seqStr =
    sequenceNumber < 10000
      ? String(sequenceNumber).padStart(4, '0')
      : String(sequenceNumber);

  return `FG-${yy}${mm}${dd}${seqStr}`;
}

/**
 * Trợ giúp lấy mã sequence tiếp theo từ danh sách các mã hiện có trong ngày
 */
export function getNextFlexGOCode(existingCodes: (string | undefined)[], date: Date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const datePrefix = `FG-${yy}${mm}${dd}`;

  let maxSeq = 0;
  for (const code of existingCodes) {
    if (code && code.startsWith(datePrefix)) {
      const seqPart = code.substring(datePrefix.length);
      const parsedSeq = parseInt(seqPart, 10);
      if (!isNaN(parsedSeq) && parsedSeq > maxSeq) {
        maxSeq = parsedSeq;
      }
    }
  }

  return generateFlexGOCode(date, maxSeq + 1);
}
