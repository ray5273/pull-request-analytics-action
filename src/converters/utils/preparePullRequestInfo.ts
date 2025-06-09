import { makeComplexRequest } from "../../requests";
import { Collection } from "../types";
import { getPullRequestSize } from "./calculations";
import { checkRevert } from "./checkRevert";
import { markdownKeywords } from "../../common/constants";
import { getMultipleValuesInput } from "../../common/utils";

export const preparePullRequestInfo = (
  pullRequest: Awaited<
    ReturnType<typeof makeComplexRequest>
  >["pullRequestInfo"][number],
  files: { filename: string; status: string }[] = [],
  collection?: Collection
) => {
  const previousComments =
    typeof collection?.comments === "number" ? collection?.comments : 0;
  const comments = previousComments + (pullRequest?.comments || 0);

  const previousReviewComments =
    typeof collection?.totalReviewComments === "number"
      ? collection?.totalReviewComments
      : 0;

  const totalReviewComments =
    previousReviewComments + (pullRequest?.review_comments || 0);

  const keywords = getMultipleValuesInput("MARKDOWN_KEYWORDS");
  const keywordsToCheck = keywords.length > 0 ? keywords : markdownKeywords;

  const hasAddedMarkdown = files.some(
    (file) => file.filename.toLowerCase().endsWith(".md") && file.status === "added"
  );
  const hasUpdatedMarkdown = files.some(
    (file) => file.filename.toLowerCase().endsWith(".md") && file.status !== "added"
  );

  const markdownKeywordsStats = { ...(collection?.markdownKeywords || {}) } as Record<string, { added?: number; updated?: number }>;
  keywordsToCheck.forEach((key) => {
    const added = files.some(
      (f) =>
        f.filename.toLowerCase().endsWith(".md") &&
        f.status === "added" &&
        f.filename.toLowerCase().includes(key.toLowerCase())
    );
    const updated = files.some(
      (f) =>
        f.filename.toLowerCase().endsWith(".md") &&
        f.status !== "added" &&
        f.filename.toLowerCase().includes(key.toLowerCase())
    );
    if (!markdownKeywordsStats[key]) {
      markdownKeywordsStats[key] = { added: 0, updated: 0 };
    }
    markdownKeywordsStats[key].added =
      (markdownKeywordsStats[key].added || 0) + (added ? 1 : 0);
    markdownKeywordsStats[key].updated =
      (markdownKeywordsStats[key].updated || 0) + (updated ? 1 : 0);
  });
  return {
    ...collection,
    opened: (collection?.opened || 0) + 1,
    closed: pullRequest?.closed_at
      ? (collection?.closed || 0) + 1
      : collection?.closed || 0,
    merged: pullRequest?.merged
      ? (collection?.merged || 0) + 1
      : collection?.merged || 0,
    comments,
    totalReviewComments,
    reverted:
      typeof pullRequest?.head.ref === "string" &&
      checkRevert(pullRequest?.head.ref)
        ? (collection?.reverted || 0) + 1
        : collection?.reverted || 0,
    additions: (collection?.additions || 0) + (pullRequest?.additions || 0),
    deletions: (collection?.deletions || 0) + (pullRequest?.deletions || 0),
    prSizes: [
      ...(collection?.prSizes || []),
      getPullRequestSize(pullRequest?.additions, pullRequest?.deletions),
    ],
    markdownAdded: (collection?.markdownAdded || 0) + (hasAddedMarkdown ? 1 : 0),
    markdownUpdated:
      (collection?.markdownUpdated || 0) + (hasUpdatedMarkdown ? 1 : 0),
    markdownKeywords: markdownKeywordsStats,
  };
};
