export interface ReleaseShortChecklist {
  id: string;
  releaseName: string;
  milestone:string;
  workWeek:string;
}

export interface Checklist {
  id: string;
  releaseChecklist:ReleaseChecklist[];
}

export interface ReleaseChecklist {
  id:string;
  vector: string;
  details:string;
  owner:string;
  status:string|undefined;
  detailedStatus:string;
  // releaseCriteria:string;
  evidences:Evidences[];
  comments:Comments[];
}

export interface ViewReleaseChecklist {
  id:string;
  vector: string;
  detail:string;
  owner:string;
  status:string|undefined;
  detailedStatus:string;
  releaseCriteria:string;
  evidences:Evidences[];
  comments:Comments[];
}

export interface Comments {
  id:string;
  message:string;
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
