/// <reference types="node" />
import { IncomingMessage } from "http";
import { Writable } from "stream";
import { PartListDataTask } from "./DataSplitter";
import { DifferentialDownloader } from "./DifferentialDownloader";
import { Operation } from "./downloadPlanBuilder";
export declare function executeTasks(differentialDownloader: DifferentialDownloader, tasks: Array<Operation>, out: Writable, oldFileFd: number, reject: (error: Error) => void): (taskOffset: number) => void;
export declare function _executeTasks(differentialDownloader: DifferentialDownloader, options: PartListDataTask, out: Writable, resolve: () => void, reject: (error: Error) => void): void;
export declare function checkIsRangesSupported(response: IncomingMessage, reject: (error: Error) => void): boolean;
