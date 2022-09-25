import { IUser} from '../user/user.interface';

interface ITask {
  summary: string;
  user?: IUser;
}

export { ITask };
