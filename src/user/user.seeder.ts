import { OnSeederInit, Seeder } from 'nestjs-sequelize-seeder';
import { User } from './user.model';

@Seeder({
  model: User,
})
export class UserSeed implements OnSeederInit {
  run() {
    const data = [
      {
        username: 'hattori',
        password: 'changeme',
        manager: true,
      },
      {
        username: 'other_user',
        password: 'changeme',
        manager: false,
      },
    ];
    return data;
  }
}
