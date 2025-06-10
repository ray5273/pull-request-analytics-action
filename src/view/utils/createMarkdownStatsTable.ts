import { Collection } from "../../converters/types";

export const createMarkdownStatsTable = (
  data: Record<string, Record<string, Collection>>,
  users: string[],
  date: string
) => {
  const markdownData = users
    .map((user) => {
      const userStats = data[user]?.[date]?.markdownStats;
      if (!userStats || userStats.totalFiles === 0) return null;
      
      return {
        user,
        added: userStats.added,
        modified: userStats.modified,
        deleted: userStats.deleted,
        totalFiles: userStats.totalFiles,
        addedFiles: userStats.addedFiles.join(", ") || "-",
        modifiedFiles: userStats.modifiedFiles.join(", ") || "-",
        deletedFiles: userStats.deletedFiles.join(", ") || "-",
        filesWithKeywords: userStats.filesWithKeywords.length > 0 
          ? userStats.filesWithKeywords.map(f => `${f.filename} (${f.keywords.join(", ")})`).join("; ")
          : "-"
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (markdownData.length === 0) return "";

  const headers = [
    "User",
    "Added",
    "Modified", 
    "Deleted",
    "Total Files",
    "Added Files",
    "Modified Files", 
    "Deleted Files",
    "Files with Keywords"
  ];

  const rows = markdownData.map((row) => [
    row.user,
    row.added.toString(),
    row.modified.toString(),
    row.deleted.toString(),
    row.totalFiles.toString(),
    row.addedFiles,
    row.modifiedFiles,
    row.deletedFiles,
    row.filesWithKeywords
  ]);
  return `
### Markdown files changes ${date}

| ${headers.join(" | ")} |
| ${headers.map(() => ":------:").join(" | ")} |
${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

#### Summary of Markdown Changes:
- **Total Markdown Files Added**: ${markdownData.reduce((sum, row) => sum + row.added, 0)}
- **Total Markdown Files Modified**: ${markdownData.reduce((sum, row) => sum + row.modified, 0)}
- **Total Markdown Files Deleted**: ${markdownData.reduce((sum, row) => sum + row.deleted, 0)}
- **Files with Special Keywords**: ${markdownData.reduce((sum, row) => sum + (row.filesWithKeywords !== "-" ? 1 : 0), 0)}
`;
};
