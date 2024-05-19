import {Component} from "@angular/core";
import {User} from "../../models/user";
import {UserService} from "../../service/UserService";

@Component({
  selector: "testing-page",
  templateUrl: "./testing-page.component.html",
  styleUrl: "./testing-page.component.less"
})
export class TestingPageComponent {
  users!: User[];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
