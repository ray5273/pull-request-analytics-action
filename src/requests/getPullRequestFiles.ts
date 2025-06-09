import { octokit } from "../octokit";
import { commonHeaders } from "./constants";
import { Repository } from "./types";

export const getPullRequestFiles = async (
  pullRequestNumbers: number[],
  repository: Repository
) => {
  const { owner, repo } = repository;
  return pullRequestNumbers.map(async (number) => {
    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
      owner,
      repo,
      pull_number: number,
      per_page: 100,
      headers: commonHeaders,
    });
    return { data: files };
  });
};
