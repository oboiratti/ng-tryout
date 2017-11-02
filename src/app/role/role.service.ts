import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../shared/common-entities.model';
import { Role } from '../auth/auth.model';

@Injectable()
export class RoleService{
 
  constructor(private httpClient: HttpClient,
    @Inject('baseApi') private baseApi: string) {}

    fetch() {
      return this.httpClient.get<ResponseObject<Role[]>>(`${this.baseApi}/profile`);
    }

    permissions() {
      return this.httpClient.get<ResponseObject<any[]>>(`${this.baseApi}/account/getroles`);
    }

    save(role: Role) {
      if (role.id) return this.httpClient.put<ResponseObject<Role>>(`${this.baseApi}/account/updateprofile`, role);
      return this.httpClient.post<ResponseObject<Role>>(`${this.baseApi}/profile`, role);
    }

    destroy(id: number) {
      return this.httpClient.delete<ResponseObject<Role>>(`${this.baseApi}/profile?id=${id}`);
    }
}
