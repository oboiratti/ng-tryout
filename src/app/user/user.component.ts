import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { User, UserQuery } from '../auth/auth.model';
import { UserService } from './user.service';
import { RoleService } from '../role/role.service';
import { MessageDialog } from '../shared/message_helper';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

declare var $:any;

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
  @BlockUI() blockForm: NgBlockUI;
  @ViewChild('closeBtn') closeBtn: ElementRef;
  @ViewChild('openBtn') openBtn: ElementRef;

  filter = [
    { label: "Name", value: { value: "name", type: "text" } },
    { label: "Email", value: { value: "email", type: "text" } },
    { label: "Username", value: { value: "username", type: "text" } }
  ]

  operation = [
    { label: "=", value: "=" },
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: ":", value: ":" }
  ]

  constructor(private formBuilder: FormBuilder, private userService: UserService, private roleService: RoleService) {
    this.userForm = this.formBuilder.group({
      id: new FormControl(''),
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')),
      phoneNumber: new FormControl(''),
      userName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(5)
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(6)
      ])),
      confirmPassword: new FormControl('', Validators.required),
      roleId: new FormControl('', Validators.required)
    }, { validator: this.checkPasswords });
  }

  ngOnInit() {
    this.fetchUsers();
    // this.roles.push({ label: "Select Role", value: null });
    this.fetchRoles();
    // this.params = <UserQuery>{ page: 0, size: 5, sortField: "id", sortOrder: -1 };
  }

  openForm() {
    this.userForm.reset();
    $("#userForm").modal("show")
  }

  closeForm() {
    this.closeBtn.nativeElement.click();
    this.userForm.reset();
  }

  checkPasswords(formGroup: FormGroup) {
    if (!formGroup.controls) return null;
    return formGroup.controls['password'].value === formGroup.controls['confirmPassword'].value ? null : { passwordMismatch: true }
  }

  selectRow(user: User) {
    this.userForm.patchValue(user);
    $("#userForm").modal("show")
  }

  save() {
    this.user = this.userForm.value;

    if (this.user.id) {
      delete this.user.password;
      delete this.user.confirmPassword;
    }

    this.blockForm.start("Saving...");
    this.saving = true;
    this.userService.save(this.user).subscribe((res) => {
      this.saving = false;
      this.blockForm.stop();
      if (res.success) {
        this.closeBtn.nativeElement.click();
        this.userForm.reset();
        this.fetchUsers();
      }
    }, err => {
      this.blockForm.stop();
      console.log("Error -> " + err.message);
    });
  }

  remove(id: number) {
    MessageDialog.confirm("Delete User", "Are you sure you want to delete this user").then((yes) => {
      if (yes) {
        this.blockForm.start("Deleting...");
        this.deleting = true;
        this.userService.destroy(id).subscribe((res) => {
          this.blockForm.stop();
          this.deleting = false;
          if (res.success) {
            this.closeBtn.nativeElement.click();
            this.userForm.reset();
            this.fetchUsers();
          }
        }, err => {
          this.blockForm.stop();
          console.log("Error -> " + err.message);
        });
      }
    }).catch((err) => {
      this.blockForm.stop();
    });
  }

  fetchUsers() {
    this.loading = true;
    this.userService.fetch().subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.users = res.data;
      }
    });
  }

  private fetchRoles() {
    this.loading = true;
    this.roleService.fetch().subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.roles = res.data;
      }
    });
  }
}
