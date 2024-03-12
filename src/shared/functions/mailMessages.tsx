var today: Date = new Date();
var currentHour: number = today.getHours();
var greeting: string = "";
const link: string = "https//lots.unicomms.app";
const username: string = "Project Management System";

if (currentHour < 12) {
  greeting = "Good Morning";
} else if (currentHour < 18) {
  greeting = "Good Afternoon";
} else {
  greeting = "Good Evening";
}
// SCORECARD DRAFT MAIL NOTIFICATIONS
export const MAIL_SCORECARD_DRAFT_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `${name} - Scorecard Submission`;
  const BODY = [
    greeting,
    "",
    `${name} has submitted a draft scorecard for review, subject for approval after performance scorecard discussion between both parties.`,
    `Kindly review the draft and schedule a meeting with ${name} to conclude the scorecard.`,
    "",
    "Visit PMS System for more.",
    "",
    "Sincerely,",
    name + " - PMS System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};

//projects
export const MAIL_PROJECT_ADDED = (employeeName: string, project: string) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    `You were added to a project (${project}) by ${employeeName}`,

    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_PROJECT_TASK_ADDED = (
  employeeName: string | null | undefined, //adder
  name: string | null | undefined, //project name or task
  type: "project" | "task",
  project?: string | null | undefined
) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    type === "project"
      ? `You were added to a project (${name}) by ${employeeName}`
      : "",
    type === "task"
      ? `You were added to a task ${name} in project ${project}`
      : "",
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_TASK_ADDED = (
  userName: string | null, //adder
  projectName: string,
  taskName: string
) => {
  const MY_SUBJECT = `${taskName}`;
  const MY_BODY = [
    `${greeting}`,

    `You were added to a task ${taskName} in project ${projectName}`,
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${userName}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_PROJECT_TASK_REMOVED = (
  employeeName: string | null | undefined, //adder
  name: string | null | undefined, //project name or task
  type: "project" | "task",
  project?: string | null | undefined
) => {
  const MY_SUBJECT = `${project}`;
  const MY_BODY = [
    `${greeting}`,
    "",
    type === "project"
      ? `You were removed to a project (${name}) by ${employeeName}`
      : "",
    type === "task"
      ? `You were removed to a task ${name} in project ${project}`
      : "",
    `Visit ${link} for more details`,
    "",
    "Regards,",
    `${username}`,
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_SCORECARD_DRAFT_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Scorecard Submission`;
  const MY_BODY = [
    greeting,
    "",
    `Your draft scorecard has been successfully submitted to your line manager for approval, subject to discussion between both parties.`,
    `Kindly schedule a meeting with your line manager to discuss the draft in person to conclude scorecard.`,
    "",
    "Regards",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

// SCORECARD Q2 MAIL NOTIFICATIONS
export const MAIL_SCORECARD_Q2_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `${name} - Mid-Term Submission`;
  const BODY = [
    greeting,
    "",
    `${name} has submitted a draft mid-term progress update for review, subject for approval after discussion between both parties.`,
    `Kindly review the draft and schedule a meeting with ${name} to conclude the mid-term progress update.`,
    "",
    "Visit PMS System for more.",
    "",
    "Sincerely,",
    name + " - PMS System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};
export const MAIL_SCORECARD_Q2_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Mid-Term Submission`;
  const MY_BODY = [
    greeting,
    "",
    `Your draft mid-term progress update has been successfully submitted to your line manager for approval, subject to discussion between both parties.`,
    `Kindly schedule a meeting with your line manager to discuss the draft in person to conclude scorecard.`,
    "",
    "Visit PMS System for more.",
    "",
    "Regards",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

// SCORECARD Q4 MAIL NOTIFICATIONS
export const MAIL_SCORECARD_Q4_SUBMITTED_MANAGER = (
  name: string | null = ""
) => {
  const SUBJECT = `${name} - Appraisal Submission`;
  const BODY = [
    greeting,
    "",
    `${name}  has submitted their self assessment for your review, subject for approval after performance appraisal discussion between both parties.`,
    `Kindly input manager rating and schedule a meeting with ${name} to conclude the appraisal. `,
    "",
    "Visit PMS System for more.",
    "",
    "Sincerely,",
    name + " - PMS System",
  ];

  return {
    SUBJECT: SUBJECT,
    BODY: BODY.join("<br/>"),
  };
};
export const MAIL_SCORECARD_Q4_SUBMITTED_ME = (name: string | null = "") => {
  const MY_SUBJECT = `${name} - Appraisal Submission`;
  const MY_BODY = [
    greeting,
    "",
    `Your self assesment has been successfully submitted to your line manager for approval, subject to discussion between both parties.`,
    `Kindly schedule a meeting with your line manager to conclude the appraisal. Ensure that you have loaded your portfolio of evidence.`,
    "",
    "Visit PMS System for more.",
    "",
    "Regards",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_SCORECARD_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Peformance Contract Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your peformance contract has been approved By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_SCORECARD_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Peformance Contract Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your peformance contract has been rejected By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_MIDTERM_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Mid-Term Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your midterm scorecard has been successfully approved By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_MIDTERM_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Mid-Term Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your midterm scorecard has been rejected By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_ASSESSMENT_APPROVED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Assessment Approval`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your assessment scorecard has been successfully approved By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};
export const MAIL_ASSESSMENT_REJECTED_ME = (
  employeeName: string | null | undefined,
  supervisorName: string | null | undefined
) => {
  const MY_SUBJECT = `${employeeName}, Assessment Rejection`;
  const MY_BODY = [
    `${greeting},`,
    "",
    `Your assessment scorecard has been rejected By ${supervisorName}.`,
    "",
    "Regards,",
    "PMS System",
  ];

  return {
    MY_SUBJECT: MY_SUBJECT,
    MY_BODY: MY_BODY.join("<br/>"),
  };
};

export const MAIL_EMAIL = "no-reply@unicomms.com";
