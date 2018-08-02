/// <reference types="node" />
import { CancellationToken, HttpExecutor, UpdateFileInfo, UpdateInfo } from "builder-util-runtime";
import { OutgoingHttpHeaders, RequestOptions } from "http";
import { URL } from "url";
import { ResolvedUpdateFileInfo } from "./main";
export declare abstract class Provider<T extends UpdateInfo> {
    protected readonly executor: HttpExecutor<any>;
    readonly useMultipleRangeRequest: boolean;
    protected requestHeaders: OutgoingHttpHeaders | null;
    protected constructor(executor: HttpExecutor<any>, useMultipleRangeRequest?: boolean);
    readonly fileExtraDownloadHeaders: OutgoingHttpHeaders | null;
    setRequestHeaders(value: OutgoingHttpHeaders | null): void;
    abstract getLatestVersion(): Promise<T>;
    abstract resolveFiles(updateInfo: UpdateInfo): Array<ResolvedUpdateFileInfo>;
    httpRequest(url: URL, headers?: OutgoingHttpHeaders | null, cancellationToken?: CancellationToken): Promise<string | null>;
    protected createRequestOptions(url: URL, headers?: OutgoingHttpHeaders | null): RequestOptions;
}
export declare function findFile(files: Array<ResolvedUpdateFileInfo>, extension: string, not?: Array<string>): ResolvedUpdateFileInfo | null | undefined;
export declare function parseUpdateInfo(rawData: string | null, channelFile: string, channelFileUrl: URL): UpdateInfo;
export declare function getFileList(updateInfo: UpdateInfo): Array<UpdateFileInfo>;
export declare function resolveFiles(updateInfo: UpdateInfo, baseUrl: URL, pathTransformer?: (p: string) => string): Array<ResolvedUpdateFileInfo>;
