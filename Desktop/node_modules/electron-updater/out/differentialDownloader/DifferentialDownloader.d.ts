/// <reference types="node" />
import { BlockMapDataHolder, HttpExecutor } from "builder-util-runtime";
import { BlockMap } from "builder-util-runtime/out/blockMapApi";
import { OutgoingHttpHeaders, RequestOptions } from "http";
import { Logger } from "../main";
export interface DifferentialDownloaderOptions {
    readonly oldFile: string;
    readonly newUrl: string;
    readonly logger: Logger;
    readonly newFile: string;
    readonly requestHeaders: OutgoingHttpHeaders | null;
    readonly useMultipleRangeRequest?: boolean;
}
export declare abstract class DifferentialDownloader {
    protected readonly blockAwareFileInfo: BlockMapDataHolder;
    readonly httpExecutor: HttpExecutor<any>;
    readonly options: DifferentialDownloaderOptions;
    private readonly baseRequestOptions;
    fileMetadataBuffer: Buffer | null;
    private readonly logger;
    constructor(blockAwareFileInfo: BlockMapDataHolder, httpExecutor: HttpExecutor<any>, options: DifferentialDownloaderOptions);
    createRequestOptions(method?: "head" | "get", newUrl?: string | null): RequestOptions;
    protected doDownload(oldBlockMap: BlockMap, newBlockMap: BlockMap): Promise<any>;
    private downloadFile(tasks);
    protected readRemoteBytes(start: number, endInclusive: number): Promise<Buffer>;
    private request(requestOptions, dataHandler);
}
export declare function readBlockMap(data: Buffer): Promise<BlockMap>;
