import { Component } from "@angular/core";
import {Router} from "@angular/router";

@Component({
  selector: "login-page",
  templateUrl: "./login-page.component.html",
  styleUrl: "./login-page.component.less"
})
export class LoginPageComponent {
  username: string = '';
  password: string = '';
  loginError: boolean = false;

  constructor(private router: Router) {}

  onSubmit() {
    if (this.username === '' && this.password === '') {
      localStorage.setItem('authToken', 'your-auth-token');
      this.router.navigate(['main']);
    } else {
      this.loginError = true;
    }
  }
}
