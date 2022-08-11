export interface Checkmarx {
  scan_id:string;
  issues:Issue[];
}

export interface Issue {
	message:string;
	severity:Severity;
	file:string;
	line:string;
	state:string;
	url:string;
}

export interface Kw {
	id: string; 
	message: string; 
	file: string; 
	method: string; 
	code: string; 
	severity: KwSeverity; 
	severityCode: KwSeverityCode; 
	state: string; 
	status: KwStatus; 
	taxonomyName: string; 
	url: string; 
	created: string;
}

export interface ScanFileInfo {
	Analyzed: number; 
	Skipped: number; 
	PendingID: number; 
	NoDiscoveries: number; 
	Declared: number; 
	Disapproved: number;
}

export interface Components {
	DiscoveredComponents: number; 
}

export interface BOM {
	TotalComponents: number; 
	TotalLicenses: number;
	LicenseList: LicenseList;
	PendingReview: number;
	LicenseViolations: number;
}

export interface LicenseList {
	License: string;
}

export interface Project {
	ServerUrl: string;
	LastAnalyzed:string;
	ScanFileInfo:ScanFileInfo;
	Components:Components;
	BOM:BOM;
}



export type KwSeverityCode = 1 | 2;
export type KwStatus = 'Ignore' | 'Analyze';
export type Severity = 'High' | 'Medium'| 'Low' | 'Information';
export type KwSeverity = 'Critical' | 'Error';

export interface DATA_COLLECTION {
	business_unit: string;
	project_id:string;
	milestone_id:string;
	file_name:string;
}

// export interface Severity {
//   high:number;
//   medium:number;
//   low:number;
//   information:number;
// }

