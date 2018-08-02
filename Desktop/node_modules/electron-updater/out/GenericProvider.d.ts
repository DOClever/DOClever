import { GenericServerOptions, UpdateInfo } from "builder-util-runtime";
import { AppUpdater } from "./AppUpdater";
import { Provider, ResolvedUpdateFileInfo } from "./main";
export declare class GenericProvider extends Provider<UpdateInfo> {
    private readonly configuration;
    private readonly updater;
    private readonly baseUrl;
    constructor(configuration: GenericServerOptions, updater: AppUpdater, useMultipleRangeRequest?: boolean);
    private readonly channel;
    getLatestVersion(): Promise<UpdateInfo>;
    resolveFiles(updateInfo: UpdateInfo): Array<ResolvedUpdateFileInfo>;
}
