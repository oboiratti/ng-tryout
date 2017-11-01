import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResponseObject } from '../shared/common-entities.model';

export class LookUps {
  static get models() {
    return [
      {label: "Title", description: "Add, Edit and Delete title", name: "title", icon: "fa fa-building text-warning"},
      {label: "Marital Status", description: "Add, Edit and Delete Marital Status", name: "marital_status", icon: "fa fa-male text-primary"},
      {label: "Educational Level", description: "Add, Edit and Delete Educational Level", name: "education_level", icon: "fa fa-graduation-cap text-danger"},
      {label: "Type", description: "Add, Edit and Delete Type", name: "type", icon: "fa fa-bandcamp text-success"}
    ];
  }
}

@Injectable()
export class SettingsService {

  model: any;

  constructor(private httpClient: HttpClient, @Inject('baseApi') private baseApi: string) { }

  fetch(name: string) {
    return this.httpClient.get<ResponseObject<any>>(`${this.baseApi}/${name}`);
  }

  save(name: string, params: any) {
    if (params.id) return this.httpClient.put<ResponseObject<any>>(`${this.baseApi}/${name}`, params);
    return this.httpClient.post<ResponseObject<any>>(`${this.baseApi}/${name}`, params);
  }

  destroy(name: string, id: number) {
    return this.httpClient.delete<ResponseObject<any>>(`${this.baseApi}/${name}/${id}`);
  }
}
