import { CancellationToken } from "./CancellationToken";
import { HttpExecutor, RequestHeaders } from "./httpExecutor";
import { BintrayOptions } from "./publishOptions";
export interface Version {
    readonly name: string;
    readonly package: string;
}
export interface File {
    name: string;
    path: string;
    sha1: string;
    sha256: string;
}
export declare class BintrayClient {
    private readonly httpExecutor;
    private readonly cancellationToken;
    private readonly basePath;
    readonly auth: string | null;
    readonly repo: string;
    readonly owner: string;
    readonly user: string;
    readonly component: string | null;
    readonly distribution: string | null;
    readonly packageName: string;
    private requestHeaders;
    setRequestHeaders(value: RequestHeaders | null): void;
    constructor(options: BintrayOptions, httpExecutor: HttpExecutor<any>, cancellationToken: CancellationToken, apiKey?: string | null);
    private bintrayRequest<T>(path, auth, data, cancellationToken, method?);
    getVersion(version: string): Promise<Version>;
    getVersionFiles(version: string): Promise<Array<File>>;
    createVersion(version: string): Promise<any>;
    deleteVersion(version: string): Promise<any>;
}
