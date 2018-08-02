/// <reference types="node" />
import { CancellationToken, PackageFileInfo, ProgressInfo, UpdateFileInfo, UpdateInfo } from "builder-util-runtime";
import { EventEmitter } from "events";
import { URL } from "url";
import { AppUpdater } from "./AppUpdater";
import { LoginCallback } from "./electronHttpExecutor";
export { AppUpdater, NoOpLogger } from "./AppUpdater";
export { UpdateInfo };
export { CancellationToken } from "builder-util-runtime";
export { Provider } from "./Provider";
export declare const autoUpdater: AppUpdater;
export interface ResolvedUpdateFileInfo {
    readonly url: URL;
    readonly info: UpdateFileInfo;
    packageInfo?: PackageFileInfo;
}
export declare function getDefaultChannelName(): string;
export declare function getCustomChannelName(channel: string): string;
export declare function getCurrentPlatform(): string;
export declare function isUseOldMacProvider(): boolean;
export declare function getChannelFilename(channel: string): string;
export interface UpdateCheckResult {
    readonly updateInfo: UpdateInfo;
    readonly downloadPromise?: Promise<Array<string>> | null;
    readonly cancellationToken?: CancellationToken;
    /** @deprecated */
    readonly versionInfo: UpdateInfo;
}
export declare type UpdaterEvents = "login" | "checking-for-update" | "update-available" | "update-cancelled" | "download-progress" | "update-downloaded" | "error";
export declare const DOWNLOAD_PROGRESS: UpdaterEvents;
export declare const UPDATE_DOWNLOADED: UpdaterEvents;
export declare type LoginHandler = (authInfo: any, callback: LoginCallback) => void;
export declare class UpdaterSignal {
    private emitter;
    constructor(emitter: EventEmitter);
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(handler: LoginHandler): void;
    progress(handler: (info: ProgressInfo) => void): void;
    updateDownloaded(handler: (info: UpdateInfo) => void): void;
    updateCancelled(handler: (info: UpdateInfo) => void): void;
}
export interface Logger {
    info(message?: any): void;
    warn(message?: any): void;
    error(message?: any): void;
    debug?(message: string): void;
}
