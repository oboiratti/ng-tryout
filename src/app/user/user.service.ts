import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../shared/common-entities.model';
import { User, UserQuery } from '../auth/auth.model';

@Injectable()
export class UserService {

  constructor(private httpClient: HttpClient,
    @Inject('baseApi') private baseApi: string) { }

  fetch() {
    return this.httpClient.get<ResponseObject<User[]>>(`${this.baseApi}/auth/users`);
  }

  query(params: UserQuery) {
    return this.httpClient.post<ResponseObject<User[]>>(`${this.baseApi}/auth/users/query`, params);
  }

  save(params: User) {
    if (params.id)  return this.httpClient.put<ResponseObject<User>>(`${this.baseApi}/auth/user`, params);
    return this.httpClient.post<ResponseObject<User>>(`${this.baseApi}/auth/register`, params);
  }

  destroy(id: number) {
    return this.httpClient.delete<ResponseObject<User>>(`${this.baseApi}/auth/user/${id}`);
  }
}
