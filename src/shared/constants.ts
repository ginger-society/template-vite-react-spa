export const STATUS_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  CREATED: 201,
  SERVER_ERROR: 500,
};

export const ROUTES = {
  SIGN_IN: "/auth/sign-in",
  HOME: "/home",
};

export const DataUploadTitleEnum = {
  "qp-data": "QP Data Load",
  "utility-data": "Utility Data Load",
  "all-etl-jobs": "ETL Job List",
};

export const BASE_URL =
  "http://ecs-services-204813822.us-east-1.elb.amazonaws.com/";
