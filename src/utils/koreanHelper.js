// 한글 받침 유무에 따른 주격 조사 반환
export const getSubjectParticle = (word) => {
    if (!word) return "";
    const lastChar = word.charCodeAt(word.length - 1);
    // 한글 음절 범위: AC00(44032) ~ D7A3(55203)
    if (lastChar < 0xAC00 || lastChar > 0xD7A3) return "가"; // 한글 아닐 경우 기본값
    const hasBatchim = (lastChar - 0xAC00) % 28 > 0;
    return hasBatchim ? "이" : "가";
};
