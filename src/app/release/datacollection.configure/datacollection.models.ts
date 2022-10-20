
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
