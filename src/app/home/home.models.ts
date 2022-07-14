export interface ReleaseShortChecklist {
  id: string;
  releaseName: string;
  milestone:string;
  workWeek:string;
}

export interface Checklist {
  id: string;
  releaseName: string;
  milestone:string;
  workWeek:string;
  releaseChecklist:ReleaseChecklist[];
}



export interface ReleaseChecklist {
  id:string;
  vector: string;
  details:string;
  owner:string;
  status:string|undefined;
  detailedStatus:string;
  releaseCriteria?:string;
  evidences:Evidences[];
  comments:Comments[];
}

// export interface ViewReleaseChecklist {
//   id:string;
//   vector: string;
//   detail:string;
//   owner:string;
//   status:string|undefined;
//   detailedStatus:string;
//   releaseCriteria:string;
//   evidences:Evidences[];
//   comments:Comments[];
// }

export interface Comments {
  id:string;
  message:string;
  file:Files[];
  date:number;
}

export interface Evidences {
  id:string;
  title:string;
  comments:string;
  evidence:string|undefined;
  date:number;
}

export interface Unit {
  /**
   * Name.
   */
  name?: string;
  /**
   * Value.
   */
  value: number;
  /**
   * Precision.
   */
  precision?: number;
  /**
   * More.
   */
  more?: string;
  /**
   * Exact.
   */
  exact?: number[];
}

export interface ViewComment {
  id:string;
  message:string;
  file:Files[];
  date:string | undefined;
}

export interface ViewEvidence {
  id:string;
  seq:number;
  evidence:string|undefined;
  title:string;
  comments:string;
  date:string | undefined;
}

export interface Details {
  id:string;
  detail:string;
  releaseCriteria:string;
}

export interface ReleaseDetails {
  id:string;
  vector:string;
  details:Details[];
}

export interface NewRelease {
  id:string;
  name:string;
  type:string;
  handover:string|null;
  milestone:string;
  date:Date;
  contact:string;
  email:string;
  businessunit:string;
  description:string;
}

export interface Files {
  id:string;
  name:string;
}

export interface Login {
  userId:string;
  password:string;
}

/**
 * New Model
 */

export interface Project {
  project_id?: number;
  project_name: string;
  project_release_date:string;
  project_description:string;
  project_business_unit_id:string;
  project_milestone_id:string;
}

export interface ReleaseTask {
  guidelines_ptr_id:number;
  owner:string;
  project_id_id:Number;
  status_id:string;
}

// export interface Guideline {
//   id:number;
//   task_name:string;
//   task_description:string;
//   required_evidence:string;
//   vector_id:string
// }

export interface BackendTask {
  guidelines_ptr_id: string;
  owner: string;
  project_id_id:string;
  status_id:string;
  backend_guideline?:BackendGuideline;
  evidences?:string[];
  comments?:string[];
}

export interface BackendGuideline {
  id: number;
  task_name: string;
  task_description:string;
  required_evidence:string;
  vector_id:string;
}

