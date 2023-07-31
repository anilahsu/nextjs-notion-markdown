
export const addZeroWidthSpace = (text: string) => {
  const punctuationRegex = /[“”「」『』【】〖〗〈〉《》）)。，]/g;
  const boldItalicRegex = /(\*\*|__|\*|_)(.*?)\1/g;

  const replacedText = text.replace(boldItalicRegex, (_, marker, content) => {
    const updatedContent = content.replaceAll(
      punctuationRegex,
      (match: string) => "\u200B" + match + "\u200B"
    );
    return `${marker}${updatedContent}${marker}`;
  });
  return replacedText;
};
