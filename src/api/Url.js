export const BASE_URL = 'http://3.137.156.123:3000/api/v1';
/* LOGIN MODULE */
export const REGISTER = BASE_URL + '/user/register';
export const LOGIN = BASE_URL + '/user/login';
export const SOCIAL_LOGIN = BASE_URL + '/user/login/sso';
export const FORGET_PASSWORD = BASE_URL + '/user/forgetpassword';
export const CHANGE_PASSWORD = BASE_URL + '/user/changepassword';

/* USER(PARENT) MODULE */
export const PARENT_PROFILE = BASE_URL + '/user';
export const SAVE_PARENT_PROFILE = BASE_URL + '/user/edit';

/* CHILD MODULE */

/*ADD CHILD*/
export const ADD_CHILD = BASE_URL + '/child/';

/*GET CHILD*/
export const GET_CHILD = BASE_URL + '/child/';

/*UPDATE CHILD*/
export const UPDATE_CHILD = BASE_URL + '/child/';

/*GET TEST*/
export const GET_TEST = BASE_URL + '/test/';

/*EDIT TEST*/
export const UPDATE_TEST = BASE_URL + '/test/';

/*IMAGE UPLOAD*/
export const IMAGE_UPLOAD = BASE_URL + '/images/upload';

/*SCAN HISTORY*/
export const SCAN_HISTORY = BASE_URL + '/diagnosis/';

/*DIAGNOSIS-RECOMMENDATION*/
export const GET_DIAGNOSIS = BASE_URL + '/diagnosis/';
/*ADD*/
export const POST_DIAGNOSIS = BASE_URL + '/diagnosis/add';
/*PROGRESS REPORT*/
export const GET_PROGRESS_REPORT = BASE_URL + '/progressreport/';

/*SCAN IMAGE UPLOAD*/
export const SCAN_IMAGE_UPLOAD = 'http://3.137.156.123:3000/api/v1/images/upload';


