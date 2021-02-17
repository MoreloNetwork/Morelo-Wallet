export class User {
  constructor(
      public id: number = 0,
      public login: string = '',
      public password: string = '',
      public email: string = '',
      public username: string = ''
  ) {}
}
