import { Collection } from "../types";
import { analyzeMarkdownFiles } from "./analyzeMarkdownFiles";

interface MarkdownFileStats {
  added: number;
  modified: number;
  deleted: number;
  totalFiles: number;
  filesWithKeywords: { filename: string; keywords: string[] }[];
  addedFiles: string[];
  modifiedFiles: string[];
  deletedFiles: string[];
}

export const prepareMarkdownStats = (
  files: any[],
  collection?: Collection
): Collection => {
  const markdownStats = analyzeMarkdownFiles(files);
  
  const existingStats = collection?.markdownStats;
  
  const aggregatedStats: MarkdownFileStats = {
    added: (existingStats?.added || 0) + markdownStats.added,
    modified: (existingStats?.modified || 0) + markdownStats.modified,
    deleted: (existingStats?.deleted || 0) + markdownStats.deleted,
    totalFiles: (existingStats?.totalFiles || 0) + markdownStats.totalFiles,
    filesWithKeywords: [
      ...(existingStats?.filesWithKeywords || []),
      ...markdownStats.filesWithKeywords
    ],
    addedFiles: [
      ...(existingStats?.addedFiles || []),
      ...markdownStats.addedFiles
    ],
    modifiedFiles: [
      ...(existingStats?.modifiedFiles || []),
      ...markdownStats.modifiedFiles
    ],
    deletedFiles: [
      ...(existingStats?.deletedFiles || []),
      ...markdownStats.deletedFiles
    ]
  };

  return {
    ...collection,
    markdownStats: aggregatedStats
  };
};
