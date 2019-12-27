interface ITodo {
  _id?: string;
  owner_id?: string;
  title?: string;
  desc?: string;
  type?: string;
  date?: Date;
  rank?: number;
  isFinish?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
