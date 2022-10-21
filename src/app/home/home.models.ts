export interface ReleaseShortChecklist {
  id: string;
  releaseName: string;
  milestone: string;
  workWeek: string;
}

export interface Checklist {
  id: string;
  releaseName: string;
  milestone: string;
  workWeek: string;
  releaseChecklist: ReleaseChecklist[];
}



export interface ReleaseChecklist {
  id: number;
  vector: string;
  details: string;
  owner: string;
  owner_email: string;
  status: string | undefined;
  detailedStatus: string[];
  releaseCriteria?: string;
  evidences: BackendEvidences[];
  comments: BackendComments[];
  bdbaStatus?: boolean;
  guidelineId?: number;
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

// export interface Comments {
//   id:number;
//   comments:string;
//   content:string;
//   date:string;
//   task_id:number;
// }

// export interface Evidences {
//   id:number;
//   title:string;
//   type:string;
//   task_id?:number;
//   comments:string;
//   evidence:string|undefined;
//   date:string;
// }

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

export interface BackendComments {
  id?: number;
  content: string;
  task_id: number;
  comments?: CommentObject;
  date: string;
}

export interface CommentObject {
  type?: string;
  content: object;
 
}



export interface Details {
  id: string;
  detail: string;
  releaseCriteria: string;
}

export interface ReleaseDetails {
  id: string;
  vector: string;
  details: Details[];
}

// export interface NewRelease {
//   id: string;
//   name: string;
//   type: string;
//   handover: string | null;
//   milestone: string;
//   date: Date;
//   contact: string;
//   email: string;
//   businessunit: string;
//   description: string;
// }

export interface Files {
  id: string;
  name: string;
}

export interface Login {
  userId: string;
  password: string;
}

/**
 * New Model
 */

export interface Project {
  project_id?: number;
  project_name: string;
  project_release_date: string;
  project_description: string;
  project_business_unit_id: string;
  project_milestone_id: string;
  project_notes?: string;
  project_owner_name: string;
  project_owner_email: string;
  // project_attorney_name: string;
  // project_attorney_email: string;
  project_release_status: string;
  project_release_type:string;
  isOverdue?:boolean;
  isReaching?:boolean;
  toolTipMessage?:string;
  project_task_status?:boolean,
  isTaskCompleted?:boolean;
  project_grading_type?:string;
  project_platform?:string;
  project_version?:string;
  tier?:string;
}

export interface Notes {
  id: string;
  note: string;
}

export interface ReleaseTask {
  guidelines_ptr_id: number;
  owner: string;
  owner_email: string;
  project_id_id: number;
  status_id: string;
}

// export interface Guideline {
//   id:number;
//   task_name:string;
//   task_description:string;
//   required_evidence:string;
//   vector_id:string
// }

export interface BackendTask {
  guidelines_ptr_id: number;
  owner: string;
  owner_email: string;
  project_id_id: string;
  status_id: string;
  backend_guideline?: BackendGuideline;
  backend_evidences?: BackendEvidences[];
  backend_comments?: BackendComments[];
}



export interface BackendEvidences {
  id: number;
  seq?: number;
  title: string;
  task_id?: number;
  comments: string;
  evidence: string;
  type: string;
  date: string;
}

export interface BackendGuideline {
  id: number;
  task_name: string;
  task_description: string;
  required_evidence: string;
  vector_id: string;
}

export interface ApiResponse {
  message: string;
}

export interface Response {
  message: string;
}

export interface Stakeholder {
  id?: number;
  name: string;
  email: string;
  wwid: string;
  role: string;
  project_id?: number;
  project_name?: string;
  project_milestone?: string;
  email_notification?:boolean;
}

export interface OwnerEmail {
  name: string;
  email: string;
  project_name: string;
  milestone: string;
  task_name: string;
}

export interface OwnerNotificationStatus {
  name: string;
  checked: boolean;
  id: string;
}

export interface NotificationSetting {
  id: number;
  qual_owner_id: string;
  setting: any;
}

export interface NotificationSettingAttributes {
  addrelease: boolean;
  assigntask: boolean;
  taskupdate: boolean;
  commentupdate: boolean;
  removerelease: boolean;
  releasestatusupdate: boolean;
  addrelease_qualowner: boolean;
  assigntask_qualowner: boolean;
  releaseschduleupdate: boolean;
  taskupdate_qualowner: boolean;
  commentupdate_qualowner: boolean;
  removerelease_qualowner: boolean;
  taskreleasestatusupdate: boolean;
  taskreleaseschduleupdate: boolean;
  releasestatusupdate_qualowner: boolean;
  releasescheduleupdate_qualowner: boolean;
  taskreleasestatusupdate_qualowner: boolean;
  taskreleaseschduleupdate_qualowner: false
}

export interface Bkc {
  seq?: number;
  id?: number;
  title: string;
  version: string;
  last_updated: string;
  comment: string;
  project_id?: number;
}


export interface Platform {
  name: string;
}
