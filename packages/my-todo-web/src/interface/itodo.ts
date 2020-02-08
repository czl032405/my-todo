interface ITodo {
  _id?: string;
  owner_id?: string;
  title?: string;
  desc?: string;
  type?: string;
  date?: Date;
  rank?: number;
  isFinish?: boolean;
  isImportant?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
