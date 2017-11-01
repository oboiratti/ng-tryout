import { Injectable, Inject } from '@angular/core';
// import { Http } from "@angular/http/http";
// import { Observable } from "rxjs/Rx";
import { User, LoginParams } from "./auth.model";
import { ResponseObject } from "../shared/common-entities.model";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class AuthService {
  currentUser: User

  constructor(private httpClient: HttpClient,
    @Inject('baseApi') private baseApi: string
  ) {
    if (localStorage.getItem("currentUser")) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    }
  }

  authenticate(params: LoginParams) {
    return this.httpClient.post<ResponseObject<User>>(`${this.baseApi}/account/login`, params)
  }

  invalidate() {
    return this.httpClient.get<ResponseObject<User>>(`${this.baseApi}/account/logout`)
  }

  setUser(user: User) {
    this.currentUser = user;
    localStorage.setItem("currentUser", JSON.stringify(user));
  }

  getUser() {
    return JSON.parse(localStorage.getItem("currentUser"));
  }

  removeUser() {
    this.currentUser = null;
    localStorage.removeItem("currentUser");
  }

  isLoggedIn() { return !!this.currentUser }
}
