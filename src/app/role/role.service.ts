import { Injectable, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../shared/common-entities.model';
import { Role } from '../auth/auth.model';

@Injectable()
export class RoleService{
 
  constructor(private httpClient: HttpClient,
    @Inject('baseApi') private baseApi: string) {}

    fetch() {
      return this.httpClient.get<ResponseObject<Role[]>>(`${this.baseApi}/roles`);
    }

    permissions() {
      return this.httpClient.get<ResponseObject<any[]>>(`${this.baseApi}/permissions`);
    }

    save(role: Role) {
      if (role.id) return this.httpClient.put<ResponseObject<Role>>(`${this.baseApi}/role`, role);
      return this.httpClient.post<ResponseObject<Role>>(`${this.baseApi}/role`, role);
    }

    destroy(id: number) {
      return this.httpClient.delete<ResponseObject<Role>>(`${this.baseApi}/role/${id}`);
    }
}
