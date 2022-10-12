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

export const NOTIFICATION_LOWER = 'notification';

export const MIMETypes = {
  txt: 'text/plain',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  doc: 'application/msword',
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  bmp: 'image/bmp',
  png: 'image/png',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  rtf: 'application/rtf',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  msg: 'application/vnd. ms-outlook'
};

export const ASSIGNED_TASK_TO_TASK_OWNER_SUBJECT = 'RTC notification for Task Owner assignment';
export const ASSIGNED_TASK_TO_TASK_OWNER_BODY = (vector: string, product: string, milestone: string, releaseDate: string) => `Please notice that you have been assigned to a  ${vector} task for product ${product},${milestone} release, which is targeting (specify the ${releaseDate}).`;

export const ASSIGNED_TASK_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Qual Owner assignment';
export const ASSIGNED_TASK_TO_QUAL_OWNER_BODY = (vector: string, product: string, milestone: string, taskOwner: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that ${taskOwner} has been assigned to a ${vector} task`;

export const TASK_STATUS_UPDATE_TO_TASK_OWNER_SUBJECT = 'RTC notification for Task Status update';
export const TASK_STATUS_UPDATE_TO_TASK_OWNER_BODY = (vector: string, product: string, milestone: string, newStatus: string) => `As a  ${vector} task owner of product ${product},${milestone} release, please notice that the task status was updated to status ${newStatus}.`;

export const TASK_STATUS_UPDATE_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Task Status update';
export const TASK_STATUS_UPDATE_TO_QUAL_OWNER_BODY = (vector: string, product: string, milestone: string, newStatus: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that a ${vector} task was updated to status ${newStatus}`;

export const TASK_COMMENTS_ADDED_TO_TASK_OWNER_SUBJECT = 'RTC notification for added Task Comments';
export const TASK_COMMENTS_ADDED_TO_TASK_OWNER_BODY = (vector: string, product: string, milestone: string, date: string, comment: string) => `As a  ${vector} task owner of product ${product},${milestone} release, please notice that the following comment has been added to the task: ${date}${comment}`;

export const TASK_COMMENTS_ADDED_TO_QUAL_OWNER_SUBJECT = 'RTC notification for added Task Comments';
export const TASK_COMMENTS_ADDED_TO_QUAL_OWNER_BODY = (vector: string, product: string, milestone: string, date: string, comment: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that the following comments have been added to a ${vector} task ${date}${comment}`;

export const RELEASE_STATUS_UPDATED_TO_TASK_OWNER_SUBJECT = 'RTC notification for Release Status update';
export const RELEASE_STATUS_UPDATED_TO_TASK_OWNER_BODY = (vector: string, product: string, milestone: string, newStatus: string) => `As a  ${vector} task owner of product ${product},${milestone} release, please notice that the release status has been updated to ${newStatus}`;

export const RELEASE_STATUS_UPDATED_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Release Status update';
export const RELEASE_STATUS_UPDATED_TO_QUAL_OWNER_BODY = (product: string, milestone: string, newStatus: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that the release status has been updated to ${newStatus}`;

export const RELEASE_SCHEDULE_UPDATED_TO_TASK_OWNER_SUBJECT = 'RTC notification for Release schedule update';
export const RELEASE_SCHEDULE_UPDATED_TO_TASK_OWNER_BODY = (vector: string, product: string, milestone: string, newReleaseDate: string, workWeek: string) => `As a  ${vector} task owner of product ${product},${milestone} release, please notice that the release target date has been updated to ${newReleaseDate}${workWeek}`;

export const RELEASE_SCHEDULE_UPDATED_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Release schedule update';
export const RELEASE_SCHEDULE_UPDATED_TO_QUAL_OWNER_BODY = (product: string, milestone: string, newReleaseDate: string, workWeek: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that the release target date has been updated to ${newReleaseDate}${workWeek}`;

// Stakeholder

export const STAKEHOLDER_ADDED_TO_STAKEHOLDER_SUBJECT = 'RTC notification for Stakeholder assignment';
export const STAKEHOLDER_ADDED_TO_TASK_OWNER_BODY = (role: string, product: string, milestone: string, workWeek: string) => `Please notice that you have been added as a  ${role} stakeholder, for product  ${product},${milestone} release, which is targeting ${workWeek}`;

export const STAKEHOLDER_ADDED_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Stakeholder assignment';
export const STAKEHOLDER_ADDED_TO_QUAL_OWNER_BODY = (product: string, milestone: string, stakeholder: string, role: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that  ${stakeholder} has been added as a ${role} stakeholder for the release.`;

export const STAKEHOLDER_REMOVED_TO_STAKEHOLDER = 'RTC notification for Task Status update';
export const STAKEHOLDER_REMOVED_TO_TASK_OWNER_BODY = (role: string, product: string, milestone: string, vector: string) => `As a ${vector} task owner of product ${product},${milestone} release, please notice that the stakeholder has been removed from the release stakeholder list`;

export const STAKEHOLDER_REMOVED_TO_QUAL_OWNER_SUBJECT = 'RTC notification for Task Status update';
export const STAKEHOLDER_REMOVED_TO_QUAL_OWNER_BODY = (product: string, milestone: string, stakeholder: string, role: string) => `As the Qualification Owner of product ${product} ,${milestone} release, please notice that  ${stakeholder} has been removed from the release stakeholder list`;

export const RELEASE_STATUS_UPDATED_TO_STAKEHOLDER_SUBJECT = 'RTC notification for Task Status update';
export const RELEASE_STATUS_UPDATED_TO_STAKEHOLDER_BODY = (role: string, product: string, milestone: string, vector: string) => `As a ${vector} task owner of product ${product},${milestone} release, please notice that the stakeholder has been removed from the release stakeholder list`;


export const openStatusArray:string[]=['WIP','Open','Pending Exception'];

export const RELEASED_LOWERCASE = 'Released';
export const ACTIVE_LOWERCASE = 'Active';
export const CANCELLED_LOWERCASE = 'Cancelled';
export const DEFERRED_LOWERCASE = 'Deferred';

export const ADMIN_USER = 'rtcadmin@intel.com';