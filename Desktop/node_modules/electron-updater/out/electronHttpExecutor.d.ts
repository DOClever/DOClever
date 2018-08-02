/// <reference types="node" />
import { DownloadOptions, HttpExecutor } from "builder-util-runtime";
import { RequestOptions } from "http";
export declare type LoginCallback = (username: string, password: string) => void;
export declare class ElectronHttpExecutor extends HttpExecutor<Electron.ClientRequest> {
    private readonly proxyLoginCallback;
    constructor(proxyLoginCallback?: ((authInfo: any, callback: LoginCallback) => void) | undefined);
    download(url: string, destination: string, options: DownloadOptions): Promise<string>;
    doRequest(options: any, callback: (response: any) => void): any;
    private addProxyLoginHandler(request);
    protected addRedirectHandlers(request: any, options: RequestOptions, reject: (error: Error) => void, redirectCount: number, handler: (options: RequestOptions) => void): void;
}
