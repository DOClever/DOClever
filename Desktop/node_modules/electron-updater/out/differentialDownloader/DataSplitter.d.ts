/// <reference types="node" />
import { Writable } from "stream";
import { Operation } from "./downloadPlanBuilder";
export interface PartListDataTask {
    readonly oldFileFd: number;
    readonly tasks: Array<Operation>;
    readonly start: number;
    readonly end: number;
}
export declare function copyData(task: Operation, out: Writable, oldFileFd: number, reject: (error: Error) => void, resolve: () => void): void;
export declare class DataSplitter extends Writable {
    private readonly out;
    private readonly options;
    private readonly partIndexToTaskIndex;
    private readonly partIndexToLength;
    private readonly finishHandler;
    partIndex: number;
    private headerListBuffer;
    private readState;
    private ignoreByteCount;
    private remainingPartDataCount;
    private readonly boundaryLength;
    constructor(out: Writable, options: PartListDataTask, partIndexToTaskIndex: Map<number, number>, boundary: string, partIndexToLength: Array<number>, finishHandler: () => any);
    readonly isFinished: boolean;
    _write(data: Buffer, encoding: string, callback: (error?: Error) => void): void;
    private handleData(chunk);
    private copyExistingData(index, end);
    private searchHeaderListEnd(chunk, readOffset);
    private actualPartLength;
    private onPartEnd();
    private processPartStarted(data, start, end);
    private processPartData(data, start, end);
}
