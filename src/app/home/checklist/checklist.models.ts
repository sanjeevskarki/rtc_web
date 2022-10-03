export interface Checkmarx {
	scan_id: string;
	issues: Issue[];
}

export interface Issue {
	message: string;
	severity: Severity;
	file: string;
	line: string;
	state: string;
	url: string;
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
	AnalyzedFiles: number;
	SkippedFiles: number;
	PendingID: number;
	PendingReviews: number;
	NoDiscoveries: number;
	// Declared: number; 
	// Disapproved: number;
}

export interface Components {
	DiscoveredComponents: number;
}

export interface BOM {
	TotalComponents: number;
	TotalLicenses: number;
	BOMComponentLicenseConflicts: number;
	FileLicenseConflicts: number;
	// LicenseList: LicenseList;
	// PendingReview: number;
	// LicenseViolations: number;
}

export interface LicenseList {
	License: string;
}

export interface Project {
	FileName?: string;
	ServerUrl: string;
	LastAnalyzed: string;
	ScanFileInfo: ScanFileInfo;
	Components: Components;
	BOM: BOM;
}



export type KwSeverityCode = 1 | 2;
export type KwStatus = 'Ignore' | 'Analyze';
export type Severity = 'High' | 'Medium' | 'Low' | 'Information';
export type KwSeverity = 'Critical' | 'Error';

export interface DataCollection {
	business_unit: string;
	project_id: string;
	milestone_id: string;
	file_type: string;
	file_name: string;
}

export interface Bdba {
	results: Result;
	meta: Meta;
}

export interface Result {
	id: number;
	status: string;
	sha1sum: string;
	product_id: number;
	name: string;
	custom_data: {};
	app_type: string;
	group_id: number;
	user: string;
	data_retention_protection: boolean;
	notify: boolean;
	last_updated: Date;
	binary_bytes: number;
	created: Date;
	scanned_bytes: number;
	components: any[];
	details: any;
	version: string;
	stale: boolean;
	report_url: string;
	summary: any;
	filename: string;
	// "rescan-possible": boolean
	// "fail-reason": ""
}

export interface Meta {
	code: number;
}

export interface TaskStatus {
	status: string;
}

export interface BdbaResults {
	project_id: string;
	results: any;
	file_name: string;
	collection_status: boolean;
}

export interface KwResults {
	project_id: string;
	results: any;
	collection_status: boolean;
}


export interface ProtexResult {
	project_id: string;
	results: {
		pendingID: string;
		lastAnalyzed: string;
		 BOMComponentLicenseConflicts: string;
	};
	id: number;
	collection_status: boolean;
}



