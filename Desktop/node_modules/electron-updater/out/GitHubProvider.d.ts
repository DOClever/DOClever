/// <reference types="node" />
import { GithubOptions, HttpExecutor, ReleaseNoteInfo, UpdateInfo, XElement } from "builder-util-runtime";
import { URL } from "url";
import { AppUpdater } from "./AppUpdater";
import { Provider, ResolvedUpdateFileInfo } from "./main";
export declare abstract class BaseGitHubProvider<T extends UpdateInfo> extends Provider<T> {
    protected readonly options: GithubOptions;
    protected readonly baseUrl: URL;
    protected readonly baseApiUrl: URL;
    protected constructor(options: GithubOptions, defaultHost: string, executor: HttpExecutor<any>);
    protected computeGithubBasePath(result: string): string;
}
export declare class GitHubProvider extends BaseGitHubProvider<UpdateInfo> {
    protected readonly options: GithubOptions;
    private readonly updater;
    constructor(options: GithubOptions, updater: AppUpdater, executor: HttpExecutor<any>);
    getLatestVersion(): Promise<UpdateInfo>;
    private getLatestVersionString(cancellationToken);
    private readonly basePath;
    resolveFiles(updateInfo: UpdateInfo): Array<ResolvedUpdateFileInfo>;
    private getBaseDownloadPath(version, fileName);
}
export declare function computeReleaseNotes(currentVersion: string, isFullChangelog: boolean, feed: XElement, latestRelease: any): string | ReleaseNoteInfo[];
