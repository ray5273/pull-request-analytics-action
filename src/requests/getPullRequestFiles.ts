import { Repository } from "./types";
import { octokit } from "../octokit";
import { commonHeaders } from "./constants";

export const getPullRequestFiles = async (
  pullRequestNumbers: number[],
  repository: Repository
) => {
  const { repo, owner } = repository;
  return pullRequestNumbers.map((number) =>
    octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number: number,
      headers: commonHeaders,
    })
  );
};
