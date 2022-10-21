
export const MILESTONE = 'milestone';
export const TASK_LOWERCASE = 'task';
export const FILE_LOWERCASE = 'file';
export const UPLOAD_LOWERCASE = 'upload';
export const IS_FOLDER_EXIST = 'isExist';
export const GUIDELINE_LOWERCASE = 'guideline';
export const TASK_STATUS_LOWERCASE = 'taskstatus';
export const STAKEHOLDER_LOWERCASE = 'stakeholder';
export const BUSINESS_UNIT = 'businessunit';
export const PROJECT = 'project';
export const BKC_LOWERCASE = 'bkc';
export const PROTEX_LOWERCASE = 'protex';
export const ROLES_LOWERCASE = 'roles';
export const BDBA_LOWERCASE = 'bdba';
export const KW_LOWERCASE = 'kw';
export const POC_UPPER = 'POC';
export const POC_LOWERCASE = 'poc';
export const PRE_ALPHA = 'Pre-Alpha';
export const ALPHA = 'Alpha';
export const EXTERNAL_LOWERCASE = 'external';
export const EXTERNAL_WITH_HANDOVER= 'External – Shipping to Customer';
export const EXTERNAL_WITHOUT_HANDOVER = 'External – Demo without Shipping to Customer';

export const INGREDIENT = 'Ingredient';
export const PLATFORM= 'Platform';
export const NOT_ASSOCIATED_PLATFORM = 'Not associated with a Platform';

export const INTERNAL = 'Internal';
export const MILESTONE_LOWERCASE = 'milestone';
export const RELEASE_TYPE_LOWERCASE = 'releasetype';
export const HANDOVER_LOWERCASE = 'handover';
export const NAME_LOWERCASE = 'name';
export const EMAIL_LOWERCASE = 'email';
export const COMMENT_LOWERCASE = 'comment';

export const BUSINESS_UNIT_LOWERCASE = 'businessunit';
export const DATE_LOWERCASE = 'date';
export const DESCRIPTION_LOWERCASE = 'description';
export const QUAL_OWNER_NAME = 'qualowner';
export const QUAL_OWNER_EMAIL = 'qualowneremail';
export const ATTORNEY_NAME = 'attorneyname';
export const ATTORNEY_EMAIL = 'attorneyemail';
export const RELEASE_STATUS = 'releasestatus';
export const RELEASE_TYPE = 'releasetype';
export const GRADING_TYPE = 'gradingtype';
export const PLATFORM_LOWERCASE = 'platform';
export const VERSION_LOWERCASE = 'version';
export const DATE_FORMAT = 'YYYY-MM-DD';
export const RTC_VERSION = 'RTC V0.1 - Release Tracking Center';
export const REPORTS_LOWERCASE = 'reports';
export const ATTACHMENTS_LOWERCASE = 'attachments';
export const DATA_COLLECTION_LOWERCASE = 'data_collection';
export const EVIDENCES_LOWERCASE = 'evidences';
export const DELETE_LOWERCASE = 'delete';
export const SUCCESS_LOWERCASE = 'success';
export const TABLE_HEADER_COLOR = '#f1f3f4';
export const BDBA_RESULTS_LOWERCASE = 'bdbaresult';
export const KW_RESULTS_LOWERCASE = 'kwresult';
export const PROTEX_RESULTS_LOWERCASE = 'protexresult';
export const AXG_LOWERCASE = 'axg';


export const ownerNotificationList: any[] = [
    { value: 'assigntask', viewValue: 'Notify owner upon assignment to a task.', checked: false },
    { value: 'taskupdate', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate', viewValue: 'Notify all task owners when release schedule was updated.', checked: false },
  ];

  export const stakeholderNotificationList: any[] = [
    { value: 'addrelease', viewValue: 'Notify stakeholder when added to a release.', checked: false },
    { value: 'removerelease', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate', viewValue: 'Notify all stakeholders when release status was updated.', checked: false },
    { value: 'releaseschduleupdate', viewValue: 'Notify all stakeholders when release schedule was updated.', checked: false }
  ];

  export const qualOwnerNotificationList: any[] = [
    { value: 'assigntask_qualowner', viewValue: 'Notify owner upon assignment to a task.', checked: false },
    { value: 'taskupdate_qualowner', viewValue: 'Notify owner upon task status update.', checked: false },
    { value: 'commentupdate_qualowner', viewValue: 'Notify owner upon task comments update.', checked: false },
    { value: 'taskreleasestatusupdate_qualowner', viewValue: 'Notify all task owners when release status was updated.', checked: false },
    { value: 'taskreleaseschduleupdate_qualowner', viewValue: 'Notify all task owners when release schedule was updated.', checked: false },
    { value: 'addrelease_qualowner', viewValue: 'Notify stakeholder when added to a release.', checked: false },
    { value: 'removerelease_qualowner', viewValue: 'Notify stakeholder when removed from a release.', checked: false },
    { value: 'releasestatusupdate_qualowner', viewValue: 'Notify all stakeholders when release status was updated.', checked: false },
    { value: 'releasescheduleupdate_qualowner', viewValue: 'Notify all stakeholders when release schedule was updated.', checked: false }
  ];
  
  export const CHECKLIST_LOWERCASE = 'checklist';