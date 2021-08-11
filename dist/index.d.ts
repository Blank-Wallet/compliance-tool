import { ComplianceInfo } from "./types";
export declare const isValidNoteString: (noteString: string) => boolean;
export declare const getComplianceInformation: (noteString: string) => Promise<ComplianceInfo>;
