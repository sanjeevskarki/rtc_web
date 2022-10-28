
export interface Protex_Config {
  id?: number;
  protex_server: string;
  protex_project_id: string;
  project_id?: number;
  user_added?:boolean;
}

export interface Kw_Config {
  id?: number;
  kw_server: string;
  kw_project_name: string;
  project_id?: number;
  user_added?:boolean;
  port: string;
}

export interface Bdba_Config {
  id?: number;
  product_id: string;
  product_name: string;
  project_id?: number;
  user_added?:boolean;
}

export interface Scan_Server {
  id?: number;
  server_name: string;
  data_collection_name: string;
  region?: string;
}

export interface ServerPort {
  name: string;
  port: string;
}

export interface ReleaseChecklistLookup {
  id: number;
  detail: string;
  release_criteria: string;
  name?: string;
  vector_name?:string;
}
