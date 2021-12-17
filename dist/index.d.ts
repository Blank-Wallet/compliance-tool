import { ComplianceInfo } from "./types";
import { ethers } from "ethers";
export declare const isValidNoteString: (noteString: string) => boolean;
export declare const getComplianceInformation: (noteString: string) => Promise<ComplianceInfo>;
export { ethers };
