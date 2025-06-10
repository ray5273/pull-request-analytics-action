            MARKDOWN_KEYWORDS: (0, utils_1.getMultipleValuesInput)("MARKDOWN_KEYWORDS"),
            MARKDOWN_KEYWORDS: (0, utils_1.getMultipleValuesInput)("MARKDOWN_KEYWORDS"),
        mixpanel_1.mixpanel.track("Anonymous action run", { distinct_id: "anonymous" });
exports.markdownKeywords = exports.periodSplitUnit = exports.executionOutcomes = exports.pullRequestSize = exports.showStatsTypes = exports.aggregateValueMethods = exports.dateFormats = void 0;
exports.markdownKeywords = ["adr", "design"];
                (0, set_1.default)(collection, [key, innerKey], (0, utils_1.preparePullRequestInfo)(pullRequest, data.files[index] || [], (0, get_1.default)(collection, [key, innerKey], {})));
const constants_1 = __nccwpck_require__(11140);
const utils_1 = __nccwpck_require__(41002);
const preparePullRequestInfo = (pullRequest, files = [], collection) => {
    const keywords = (0, utils_1.getMultipleValuesInput)("MARKDOWN_KEYWORDS");
    const keywordsToCheck = keywords.length > 0 ? keywords : constants_1.markdownKeywords;
    const hasAddedMarkdown = files.some((file) => file.filename.toLowerCase().endsWith(".md") && file.status === "added");
    const hasUpdatedMarkdown = files.some((file) => file.filename.toLowerCase().endsWith(".md") && file.status !== "added");
    const markdownKeywordsStats = { ...(collection?.markdownKeywords || {}) };
    keywordsToCheck.forEach((key) => {
        const added = files.some((f) => f.filename.toLowerCase().endsWith(".md") &&
            f.status === "added" &&
            f.filename.toLowerCase().includes(key.toLowerCase()));
        const updated = files.some((f) => f.filename.toLowerCase().endsWith(".md") &&
            f.status !== "added" &&
            f.filename.toLowerCase().includes(key.toLowerCase()));
        if (!markdownKeywordsStats[key]) {
            markdownKeywordsStats[key] = { added: 0, updated: 0 };
        }
        markdownKeywordsStats[key].added =
            (markdownKeywordsStats[key].added || 0) + (added ? 1 : 0);
        markdownKeywordsStats[key].updated =
            (markdownKeywordsStats[key].updated || 0) + (updated ? 1 : 0);
    });
        markdownAdded: (collection?.markdownAdded || 0) + (hasAddedMarkdown ? 1 : 0),
        markdownUpdated: (collection?.markdownUpdated || 0) + (hasUpdatedMarkdown ? 1 : 0),
        markdownKeywords: markdownKeywordsStats,
const getPullRequestFiles_1 = __nccwpck_require__(19404);
    const PRFiles = [];
        const pullRequestFiles = await (0, getPullRequestFiles_1.getPullRequestFiles)(pullRequestNumbersChunks, repository);
        const files = await Promise.allSettled(pullRequestFiles);
        await (0, delay_1.delay)(5000);
        PRFiles.push(...files);
    return { PRs, PREvents, PRComments, PRFiles };
/***/ }),

/***/ 19404:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPullRequestFiles = void 0;
const octokit_1 = __nccwpck_require__(75455);
const constants_1 = __nccwpck_require__(8827);
const getPullRequestFiles = async (pullRequestNumbers, repository) => {
    const { owner, repo } = repository;
    return pullRequestNumbers.map(async (number) => {
        const files = await octokit_1.octokit.paginate(octokit_1.octokit.rest.pulls.listFiles, {
            owner,
            repo,
            pull_number: number,
            per_page: 100,
            headers: constants_1.commonHeaders,
        });
        return { data: files };
    });
};
exports.getPullRequestFiles = getPullRequestFiles;


    const { PRs, PREvents, PRComments, PRFiles } = await (0, getDataWithThrottle_1.getDataWithThrottle)(pullRequestNumbers, repository, options);
    const files = PRFiles.map((element) => element.status === "fulfilled" ? element.value.data : null);
        files,
            files: [...(acc?.files || []), ...(element.files || [])],
            files: [],
