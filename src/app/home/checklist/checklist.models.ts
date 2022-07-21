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

export type Severity = 'High' | 'Medium'| 'Low' | 'Information';

// export interface Severity {
//   high:number;
//   medium:number;
//   low:number;
//   information:number;
// }

