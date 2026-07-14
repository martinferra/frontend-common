import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class RegistrationReq {
  constructor(email?: string, fullname?: string) {
    if (email) {
      this.email = email;
    }
    if (fullname) {
      this.fullname = fullname;
    }
  }

  @Expose()
  _id!: string;

  @Expose()
  email!: string;

  @Expose()
  fullname!: string;
}
