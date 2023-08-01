export const parseMarkdown = (markdown: string) => {
  console.log("start to parse markdown");
  let blocks = [];
  let count = 0;
  try {
    let text = markdown;
    while (text) {
      // console.log(count++);
      const mat = text.match(/^@\{\{\{\s*?([^\s]+)\s*?\}\}\}@/m);
      // console.log( mat ,` mat0: ${mat!=null && mat[0]}, mat1: ${ mat!=null && mat[1]} `)
      if (mat === null) {
        if (text.length > 0) {
          blocks.push({ kind: "markdown", data: text });
        }
        break;
      }
      const before = text.slice(0, mat.index).trim();
      if (before.length > 0) {
        console.log("before");
        blocks.push({ kind: "markdown", data: before });
      }
      const key = mat[1].trim();
      if (key.length > 0) {
        blocks.push({ kind: "static", data: key });
      }
      if (mat.index || mat.index === 0) {
        console.log(
          `mat index: ${mat.index}, mat0: ${mat[0]}, mat1: ${mat[1]} `
        );
        const after = text.slice(mat.index + mat[0].length).trim();
        console.log(text.length);
        text = after;
        console.log(text.length);
      }
    }
  } catch (error) {
    console.log(error);
  }
  // console.log(blocks, blocks.length);
  return blocks;
};
