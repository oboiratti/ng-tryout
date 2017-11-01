import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User, UserQuery } from '../auth/auth.model';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { MessageDialog } from '../shared/message_helper';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  loading: boolean;
  showForm: boolean;
  saving: boolean;
  deleting: boolean;

  users: User[]
  roles: any[] = [];
  userForm: FormGroup;
  user: User;
  selectedUser: User;
  params: UserQuery;
  totalRecords: number;
  selectedFilter: any;

  filter = [
    {label: "Name", value: {value: "name", type: "text"}},
    {label: "Email", value: {value: "email", type: "text"}},
    {label: "Username", value: {value: "username", type: "text"}}
  ]

  operation = [
    {label: "=", value: "="},
    {label: ">", value: ">"},
    {label: "<", value: "<"},
    {label: ":", value: ":"}
  ]

  constructor(private formBuilder: FormBuilder, private userService: UserService, private roleService: RoleService) {
    this.userForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
      username: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      passwordConfirmation: new FormControl('', Validators.required),
      role: new FormControl('', Validators.required)
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    // this.fetchUsers();
    // this.roles.push({ label: "Select Role", value: null });
    this.fetchRoles();
    this.params = <UserQuery>{ page: 0, size: 5, sortField: "id", sortOrder: -1 };
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.userForm.reset();
  }

  checkPasswords(formGroup: FormGroup) {
    if (!formGroup.controls) return null;
    return formGroup.controls['password'].value === formGroup.controls['passwordConfirmation'].value ? null : { passwordMismatch: true }
  }

  onRowSelect(event) {
    this.userForm.patchValue(event.data);
    this.showForm = true;
  }

  save() {
    this.user = this.userForm.value;
    this.saving = true;
    this.userService.save(this.user).subscribe((res) => {
      this.saving = false;
      if (res.success) {
        this.showForm = false;
        this.userForm.reset();
        this.fetchUsers();
      }
    }, err => {
      console.log("Error -> " + err.message);
    });
  }

  remove(id: number) {
    MessageDialog.confirm("Delete User", "Are you sure you want to delete this user").then((yes) => {
      if (yes) {
        this.deleting = true;
        this.userService.destroy(id).subscribe((res) => {
          this.deleting = false;
          if (res.success) {
            this.showForm = false;
            this.userForm.reset();
            this.fetchUsers();
          }
        }, err => {
          console.log("Error -> " + err.message);
        });
      }
    }).catch((err) => {});
  }

  fetchUsers(event?: any) {
    this.loading = true;
    
    if (event) {
      this.params.page = event.first / event.rows;
      this.params.size = event.rows;
      this.params.sortField = event.sortField || this.params.sortField;
      this.params.sortOrder = event.sortOrder;
    }
    
    this.userService.query(this.params).subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.users = res.data;
        this.totalRecords = res.total;
      }
    });
  }

  private fetchRoles() {
    this.loading = true;
    this.roleService.fetch().subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.roles = res.data.map((role) => {
          return { label: role.name, value: role }
        })
      }
    });
  }
}
