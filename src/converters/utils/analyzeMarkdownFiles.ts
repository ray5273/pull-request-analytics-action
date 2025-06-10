import { getMultipleValuesInput } from "../../common/utils";

export interface MarkdownFileStats {
  added: number;
  modified: number;
  deleted: number;
  totalFiles: number;
  filesWithKeywords: { filename: string; keywords: string[] }[];
  addedFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
}

export const analyzeMarkdownFiles = (files: any[]): MarkdownFileStats => {
  if (!files || !Array.isArray(files)) {
    return {
      added: 0,
      modified: 0,
      deleted: 0,
      totalFiles: 0,
      filesWithKeywords: [],
      addedFiles: [],
      modifiedFiles: [],
      deletedFiles: []
    };
  }

  const markdownFiles = files.filter(file => 
    file && file.filename && file.filename.toLowerCase().endsWith('.md')
  );

  const stats: MarkdownFileStats = {
    added: 0,
    modified: 0,
    deleted: 0,
    totalFiles: markdownFiles.length,
    filesWithKeywords: [],
    addedFiles: [],
    modifiedFiles: [],
    deletedFiles: []
  };

  // 환경변수에서 키워드를 가져오거나 기본값 사용
  const configuredKeywords = getMultipleValuesInput("MARKDOWN_KEYWORDS");
  const defaultKeywords = ['readme', 'doc', 'guide', 'tutorial', 'changelog', 'migration', 'api'];
  const keywordsToUse = configuredKeywords.length > 0 ? configuredKeywords : defaultKeywords;

  markdownFiles.forEach(file => {
    const filename = file.filename.toLowerCase();
    
    // 파일 상태별 분류
    switch (file.status) {
      case 'added':
        stats.added++;
        stats.addedFiles.push(file.filename);
        break;
      case 'modified':
        stats.modified++;
        stats.modifiedFiles.push(file.filename);
        break;
      case 'removed':
        stats.deleted++;
        stats.deletedFiles.push(file.filename);
        break;
    }    // 키워드 검색
    const foundKeywords = keywordsToUse.filter(keyword => 
      filename.includes(keyword.toLowerCase())
    );

    if (foundKeywords.length > 0) {
      stats.filesWithKeywords.push({
        filename: file.filename,
        keywords: foundKeywords
      });
    }
  });

  return stats;
};

export const checkMarkdownKeywords = (filename: string, keywords: string[]): string[] => {
  const lowerFilename = filename.toLowerCase();
  return keywords.filter(keyword => lowerFilename.includes(keyword.toLowerCase()));
};
