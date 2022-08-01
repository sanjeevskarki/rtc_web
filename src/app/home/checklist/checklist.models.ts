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
  "id": string, 
	"message": string, 
	"file": string, 
	"method": string, 
	"code": string, 
	"severity": KwSeverity, 
	"severityCode": KwSeverityCode, 
	"state": string, 
	"status": string, 
	"taxonomyName": string, 
	"url": string, 
	"created": string
}

export type KwSeverityCode = 1 | 2;
export type KwSeverity = 'Ignore' | 'Analyze';
export type Severity = 'High' | 'Medium'| 'Low' | 'Information';

// export interface Severity {
//   high:number;
//   medium:number;
//   low:number;
//   information:number;
// }

