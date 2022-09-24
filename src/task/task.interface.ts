import { IUser} from '../user/user.interface';

interface ITask {
  date: Date;
  summary: string;
  user?: IUser;
}

export { ITask };
