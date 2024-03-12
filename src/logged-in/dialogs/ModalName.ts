const MODAL_NAMES = {
  EXECUTION: {
    VIEW_REVIEW_MODAL: "view-review-modal",
    MAP_OVERVIEW_MODAL: "map-overview-modal",
    COMPANY_MAP_OVERVIEW_MODAL: "company-map-overview-modal",
    OBJECTIVE_MODAL: "objective-modal",
    PERSPECTIVE_OBJECTIVE_MODAL: "perspective-objective-modal",
    MEASURE_MODAL: "measure-modal",
    MEASURE_COMMENTS_MODAL: "measure-comments-modal",
    MEASURE_UPDATE_MODAL: "measure-update-modal",
    MEASURE_UPDATE_MIDTERM_ACTUAL_MODAL: "measure-update-midterm-actual-modal",
    MEASURE_UPDATE_ANNUAL_ACTUAL_MODAL: "measure-update-annual-actual-modal",

    SCORECARD_DRAFT_APPROVAL_MODAL: "scorecard-draft-approval-modal",
    SCORECARD_DRAFT_REJECTION_MODAL: "scorecard-draft-rejection-modal",
    SCORECARD_Q2_APPROVAL_MODAL: "scorecard-q2-approval-modal",
    SCORECARD_Q2_REJECTION_MODAL: "scorecard-q2-rejection-modal",
    SCORECARD_Q4_APPROVAL_MODAL: "scorecard-q4-approval-modal",
    SCORECARD_Q4_REJECTION_MODAL: "scorecard-q4-rejection-modal",

    DEPARTMENT_OBJECTIVE_MODAL: "department-objective-modal",
    DEPARTMENT_MEASURE_COMMENTS_MODAL: "department-measure-status-update-modal",
    DEPARTMENT_MEASURE_MODAL: "department-measure-modal",
    DEPARTMENT_MEASURE_UPDATE_Q1_ACTUAL_MODAL:
      "department-measure-update-q1-actual-modal",
    DEPARTMENT_MEASURE_UPDATE_Q2_ACTUAL_MODAL:
      "department-measure-update-q2-actual-modal",
    DEPARTMENT_MEASURE_UPDATE_Q3_ACTUAL_MODAL:
      "department-measure-update-q3-actual-modal",
    DEPARTMENT_MEASURE_UPDATE_Q4_ACTUAL_MODAL:
      "department-measure-update-q4-actual-modal",
    DEPARTMENT_DRAFT_APPROVAL_MODAL: "department-draft-approval-modal",

    READ_DEPARTMENT_SCORECARD_COMMENT_MODAL:
      "read-department-scorecard-comment-modal",
    READ_SCORECARD_COMMENT_MODAL: "read-scorecard-comment-modal",
    READ_COMPANY_SCORECARD_COMMENT_MODAL:
      "read-company-scorecard-comment-modal",

    DEPARTMENT_DRAFT_REJECTION_MODAL: "department-draft-rejection-modal",
    DEPARTMENT_Q1_APPROVAL_MODAL: "department-q1-approval-modal",
    DEPARTMENT_Q1_REJECTION_MODAL: "department-q1-rejection-modal",
    DEPARTMENT_Q2_APPROVAL_MODAL: "department-q2-approval-modal",
    DEPARTMENT_Q2_REJECTION_MODAL: "department-q2-rejection-modal",
    DEPARTMENT_Q3_APPROVAL_MODAL: "department-q3-approval-modal",
    DEPARTMENT_Q3_REJECTION_MODAL: "department-q3-rejection-modal",
    DEPARTMENT_Q4_APPROVAL_MODAL: "department-q4-approval-modal",
    DEPARTMENT_Q4_REJECTION_MODAL: "department-q4-rejection-modal",

    COMPANY_MEASURE_MODAL: "company-measure-modal",
    COMPANY_MEASURE_COMMENTS_MODAL: "company-measure-status-update-modal",
    COMPANY_MEASURE_STATUS_UPDATE_MODAL: "company-measure-status-update-modal",

    COMPANY_MEASURE_UPDATE_Q1_ACTUAL_MODAL:
      "company-measure-update-q1-actual-modal",
    COMPANY_MEASURE_UPDATE_Q2_ACTUAL_MODAL:
      "company-measure-update-q2-actual-modal",
    COMPANY_MEASURE_UPDATE_Q3_ACTUAL_MODAL:
      "company-measure-update-q3-actual-modal",
    COMPANY_MEASURE_UPDATE_Q4_ACTUAL_MODAL:
      "company-measure-update-q4-actual-modal",

    COMPANY_DRAFT_APPROVAL_MODAL: "company-draft-approval-modal",
    COMPANY_DRAFT_REJECTION_MODAL: "company-draft-rejection-modal",
    COMPANY_Q1_APPROVAL_MODAL: "company-q1-approval-modal",
    COMPANY_Q1_REJECTION_MODAL: "company-q1-rejection-modal",
    COMPANY_Q2_APPROVAL_MODAL: "company-q2-approval-modal",
    COMPANY_Q2_REJECTION_MODAL: "company-q2-rejection-modal",
    COMPANY_Q3_APPROVAL_MODAL: "company-q3-approval-modal",
    COMPANY_Q3_REJECTION_MODAL: "company-q3-rejection-modal",
    COMPANY_Q4_APPROVAL_MODAL: "company-q4-approval-modal",
    COMPANY_Q4_REJECTION_MODAL: "company-q4-rejection-modal",

    TASK_MODAL: "task-modal",
    PROJECT_MODAL: "project-modal",
    SCORECARD_MODAL: "scorecard-modal",
    JOBCARD_MODAL: "jobcard-modal",
    VIEWJOBCARD_MODAL: "view-jobcard-modal",
    EDITJOBCARD_MODAL: "edit-jobcard-modal",
    JOBCARDFEEDBACK_MODAL: "jobcard-feedback--modal",
  },
  PERFORMANCE_REVIEW: {
    REVIEW_MODAL: "performance-review-modal",
    GIVE_REVIEW_MODAL: "give-review-modal",
  },
  PROOF_OF_WORK: {
    FOLDER_MODAL: "folder-modal",
    FOLDER_FILE_MODAL: "folder-file-modal",
    FOLDER_FILE_UPLOADER_MODAL: "folder-file-uploader-modal",
  },
  ADMIN: {
    JOBCARD_USER_MODAL: "job-card-user-modal",
    USER_MODAL: "user-modal",
    ROLE_MODAL: "role-modal",
    SCORECARD_BATCH_MODAL: "scorecard-batch-modal",
    DEPARTMENT_MODAL: "department-modal",
    BUSINESS_UNIT_MODAL: "business-unit-modal",
    VM_MODAL: "vision-mission-modal",
    STRATEGIC_THEME_MODAL: "strategic-theme-modal",
  },
  PROJECTS: {
    CREATE_PROJECT: "newProject-Modal",
    CREATE_TASK: "newTask-Modal",
    CREATE_MILESTONE: "newMilestone-Modal",
    CREATE_RISK: "newRisk-modal",
    CREATE_PORTFOLIO: "newPortfolio-modal",
    VIEW_TASK: "view-Task-Modal",
    VIEW_RISK: "view-Risk-Modal",
    ADD_USER: "add-user-modal",
    PROJECT_FILES: "project-files-modal",
    ATTACH_MILESTONE_BILL: "attach-bill-modal",
  },
  GENERAL_TASKS: {
    CREATE_GENERAL_TASK: "general-tasks-modal",
    VIEW_GENERAL_TASKS: "view-general-task-modal",
  },

  CHECKIN: {
    CHECK_IN_YEAR: "check-in-year-modal",
    CHECK_IN_MONTH: "check-in-month-modal",
    CHECK_IN_WEEK: "check-in-week-modal",
    CHECK_IN_WEEK_TASK: "check-in-week-task-modal",
  },

  JOBCARD:{
    CREATE_TASK:"add-task",
    EDIT_TASK:"edit-task",

    CREATE_EXPENSE:"add-expense",
    EDIT_EXPENSE:"edit-expense",

    CREATE_MATERIAL:"add-material",
    EDIT_MATERIAL:"edit-material",

    CREATE_TOOL:"add-tool",
    EDIT_TOOL:"edit-tool",

    CREATE_LABOUR:"add-labour",
    EDIT_LABOUR:"edit-labour",
  },

  DOCUMENT_VIEWER: {
    VIEW_DOCUMENTS: "view-documents",
  },
};

export default MODAL_NAMES;
