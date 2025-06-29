// GitHub API service for fetching commit information
const GITHUB_API_BASE = "https://api.github.com";

export const fetchLatestCommit = async (repoPath) => {
  try {
    if (!repoPath) {
      throw new Error("Repository path is required");
    }

    // Parse the repository path (format: owner/repo)
    const [owner, repo] = repoPath.split("/");

    if (!owner || !repo) {
      throw new Error("Invalid repository path format. Expected: owner/repo");
    }

    // Fetch the latest commit from the main branch
    const response = await fetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1&sha=main`
    );

    if (!response.ok) {
      // Try with 'master' branch if 'main' fails
      const masterResponse = await fetch(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits?per_page=1&sha=master`
      );

      if (!masterResponse.ok) {
        throw new Error(
          `Failed to fetch commits: ${response.status} ${response.statusText}`
        );
      }

      const commits = await masterResponse.json();
      return commits[0] || null;
    }

    const commits = await response.json();
    return commits[0] || null;
  } catch (error) {
    console.error("Error fetching latest commit:", error);
    throw error;
  }
};

export const fetchCommitMessage = async (repoPath) => {
  try {
    const commit = await fetchLatestCommit(repoPath);
    return commit ? commit.commit.message : null;
  } catch (error) {
    console.error("Error fetching commit message:", error);
    return null;
  }
};

export const fetchCommitInfo = async (repoPath) => {
  try {
    const commit = await fetchLatestCommit(repoPath);
    if (!commit) {
      return null;
    }

    return {
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      sha: commit.sha.substring(0, 7), // Short SHA
      url: commit.html_url,
    };
  } catch (error) {
    console.error("Error fetching commit info:", error);
    return null;
  }
};
