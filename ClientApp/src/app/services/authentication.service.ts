import { Injectable, Inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { map } from "rxjs/operators";
import { User } from '../models/user';

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  constructor(private http: HttpClient, @Inject("BASE_URL") baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  baseUrl: string;

  login(username: string, password: string) {
    const userParam = new User();
    userParam.Password = password;
    userParam.Username = username;
    userParam.FirstName = '';
    console.log(userParam);
    console.log(JSON.stringify(userParam));
    const body = JSON.stringify(userParam);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<User>(`${this.baseUrl}api/users/authenticate`, body, { headers: headerOptions })
      .pipe(
        map((user: User) => {
          // login successful if there's a jwt token in the response
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
          }

          return user;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
  }
}
