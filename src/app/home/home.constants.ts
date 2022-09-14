export const FUTURE = (time: string) => `in ${time}`;
export const PAST = (time: string) => `${time} ago`;
export const TIMEINTERVAL = {
  SECOND: (count: number, more: number) => `a moment`,
  SECONDS: (count: number, more: number) => `a moment`,
  MINUTE: (count: number, more: number) => `one minute`,
  MINUTES: (count: number, more: number) => `${count} minutes`,
  HOUR: (count: number, more: number) => `one hour`,
  HOUR_15: (count: number, more: number) => `one hour and 15 minutes`,
  HOUR_15S: (count: number, more: number) => `one hour and ${more} minutes`,
  HOURS: (count: number, more: number) => `${count} hours`,
  HOURS_15: (count: number, more: number) => `${count} hours and 15 minutes`,
  HOURS_15S: (count: number, more: number) => `${count} hours and ${more} minutes`,
  DAY: (count: number, more: number) => `one day`,
  DAY_HOUR: (count: number, more: number) => `one day and one hour`,
  DAY_HOURS: (count: number, more: number) => `one day and ${more} hours`,
  DAYS: (count: number, more: number) => `${count} days`,
  DAYS_HOUR: (count: number, more: number) => `${count} days and one hour`,
  DAYS_HOURS: (count: number, more: number) => `${count} days and ${more} hours`,
  WEEK: (count: number, more: number) => `one week`,
  WEEKS: (count: number, more: number) => `${count} weeks`,
  MONTH: (count: number, more: number) => `one month`,
  MONTH_DAY: (count: number, more: number) => `one month and one day`,
  MONTHS: (count: number, more: number) => `${count} months`,
  MONTHS_DAYS: (count: number, more: number) => `${count} months and ${more} days`,
  YEAR: (count: number, more: number) => `one year`,
  YEAR_MONTH: (count: number, more: number) => `one year and one month`,
  YEAR_MONTHS: (count: number, more: number) => `one year and ${more} months`,
  YEARS: (count: number, more: number) => `${more} years`,
  YEARS_MONTH: (count: number, more: number) => `${count}  years and one month`,
  YEARS_MONTHS: (count: number, more: number) => `${count}  years and ${more} months`,
};

export const PROJECT = 'project';

export const PROTEX_SCAN_FILE = 'protex_scanresults_c_idiwellnesspcathena_46683.xml';
export const PROTEX_META_SCAN_FILE1 = 'ds5_meta_driver.xml';
export const PROTEX_META_SCAN_FILE2 = 'ds5_meta_release.xml';
export const PROTEX_D457_SCAN_FILE1 = 'd457_fw.xml';
export const PROTEX_D457_SCAN_FILE2 = 'd457_kernal.xml';
export const KW_SCAN_FILE = 'Perc_HW_DS5_B0_Dev_fw_kw.json';
export const CHECKMARX_SCAN_FILE = 'checkmarx_issues.json';
export const DATA_COLLECTION = 'data_collection';

export const BDBA_SCAN_FILE = '_bdba.json';
export const BDBA_SCAN_PDF_FILE = '_bdba.pdf';
export const FILE_PATH = 'assets/data/';

export const STATIC_ANALYSIS_ISSUE = 'staticanalysisissues';
export const PROTEX_MATCHES_LICENSE_CONFLICTS = 'protexmatches&licenseconflicts';
// export const STATIC_ANALYSIS_ISSUE = 'staticanalysisissues';
export const COMPOSITION_ANALYSIS_ISSUES = 'compositionanalysisissues';

export const MIMETypes={
  txt :'text/plain',
  docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc : 'application/msword',
  pdf : 'application/pdf',
  jpg : 'image/jpeg',
  bmp : 'image/bmp',
  png : 'image/png',
  xls : 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  rtf : 'application/rtf',
  ppt : 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
};