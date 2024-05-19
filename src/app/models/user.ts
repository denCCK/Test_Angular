export class User {
  id: number;
  userlogin: string;
  userpassword: string;
  username: string;
  usersurname: string;
  userrole: number;

  constructor(id: number, userlogin: string, userpassword: string, username: string, usersurname: string, userrole: number) {
    this.id = id;
    this.userlogin = userlogin;
    this.userpassword = userpassword;
    this.username = username;
    this.usersurname = usersurname;
    this.userrole = userrole;
  }
}
