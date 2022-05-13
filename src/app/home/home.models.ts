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
  releaseCriteria:string;
  evidence:string;
  comments:Comments[];
}

export interface Comments {
  message:string;
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
  message:string;
  date:string | undefined;
}