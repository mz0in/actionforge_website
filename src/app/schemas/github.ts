
export interface IGithubFile {
    type: string;
    target: string;
    encoding: string;
    size: number;
    name: string;
    path: string;
}

export interface IGithubAuthor {
    date: Date;
    name: string;
    email: string;
}

export interface IGithubTagCommit {
    sha: string;
    author: IGithubAuthor;
    committer: IGithubAuthor;
}

export interface IGithubTag {
    sha: string;
    author: IGithubAuthor;
    committer: IGithubAuthor;
    name: string;
}

export interface IGithubBranchCommit {
    sha: string;
    author: IGithubUser;
    committer: IGithubUser;
}

export interface IGithubBranch {
    name: string;
    commit: IGithubBranchCommit;
}

export interface IGithubRepo {
    id: number;
    name: string;
    fullname: string;
    owner: string;
    description: string;
    homepage: string;
    default_branch: string;
    master_branch: string;
    created_at: Date;
    pushed_at: Date;
    language: string;
    topics: string[],
    private: boolean,
    license: {
        key?: string;
        name?: string;
        url?: string;
    };
    html_url: string;
    forks_count: number;
    stargazers_count: number;
}

export interface IGithubUser {
    id: string;
    name: string;
    avatar_url: string;
    is_me: boolean;
}