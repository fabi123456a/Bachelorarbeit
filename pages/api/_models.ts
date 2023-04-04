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

export type ModelSession = {
  id: string;
  idUser: string;
};

export type ModelChatEntry = {
  id      :string;
  idScene :string;
  idUser  :string;
  message :string;
  datum   : Date;
}
