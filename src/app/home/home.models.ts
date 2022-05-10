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
  date:Date;
}