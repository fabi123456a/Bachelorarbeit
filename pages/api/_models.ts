// TODO models von datenbank hier reinschreiben
export type ModelUser = {
  id: string;
  loginID: string;
  password: string;
};

export type ModelScene = {
  id: string;
  idUserCreater: string;
  name: string;
  createDate: Date;
  path: string;
};
