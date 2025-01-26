export default function copyToClipboard(text: string, successMessage: string) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    // Clipboard API 지원 시
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert(successMessage);
      })
      .catch((err) => {
        alert("클립보드 복사에 실패했어요");
        console.error("클립보드 복사 실패:", err);
      });
  } else {
    // Clipboard API 미지원 시 폴백
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      const successful = document.execCommand("copy");
      if (successful) {
        alert(successMessage);
      } else {
        alert("클립보드 복사에 실패했어요");
        console.error("텍스트 복사 실패 (Fallback).");
      }
    } catch (err) {
      alert("클립보드 복사에 실패했어요");
      console.error("execCommand 복사 실패:", err);
    }
    document.body.removeChild(textarea);
  }
}
