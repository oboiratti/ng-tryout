import { Component, OnInit } from '@angular/core';
import { RoleService } from './role.service';
import { Role } from '../auth/auth.model';
import { MessageDialog } from '../shared/message_helper';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

  loading: boolean;
  saving: boolean;
  deleting: boolean;

  roles: Role[];
  showForm: boolean;
  permissions: any[] = [];
  role = <Role>{};
  checkAll: boolean;

  constructor(private roleService: RoleService) { }

  ngOnInit() {
    this.fetchRoles();
    this.fetchPermissions();
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.role = <Role>{};
    this.permissions.forEach((perm) => {
      perm.checked = false;
    });
  }

  selectRow(role: Role) {
    this.role = role;
    let perms = role.permissions.split(", ");
    this.permissions.forEach((perm) => {
      perm.checked = false;
      perm.checked = perms.includes(perm.name)
    });

    if (perms.length == this.permissions.length) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
    this.showForm = true;
    console.log(this.permissions);
    
  }

  selectOne(perm, event) {
    let cnt = 0;
    this.permissions.find(obj => obj.id === perm.id).checked = event.target.checked;
    console.log(this.permissions);
    this.permissions.map((perm) => {
      if (perm.checked) cnt++;
    });
console.log(cnt);

    if (cnt == this.permissions.length) {
      this.checkAll = true;
    } else {
      this.checkAll = false;
    }
  }

  selectAll(event) {
    this.permissions.map((perm) => {
      perm.checked = event.target.checked
    });
    this.checkAll = true;
  }

  save() {
    let permString = "";
    this.permissions.map((perm) => {
      if (perm.checked) {
        permString += perm.name;
        permString += ", ";
      }
    });
    permString = permString.substring(0, permString.length - 2);
    this.role.permissions = permString;

    if (!this.role.name) {
      MessageDialog.error("Please enter the name of the role to be created");
      return;
    }

    if (this.role.permissions === "") {
      MessageDialog.error("Role must have at least one permission");
      return;
    }
    
    this.saving = true;
    this.roleService.save(this.role).subscribe((res) => {
      this.saving = false;
      if (res.success) {
        this.showForm = false;
        this.fetchRoles();
      }
    }, err => {
      console.log("Error -> " + err.message);
    });
  }

  remove(id: number) {
    MessageDialog.confirm("Delete Role", "Are you sure you want to delete this role").then((yes) => {
      if (yes) {
        this.deleting = true;
        this.roleService.destroy(id).subscribe((res) => {
          this.deleting = false;
          if (res.success) {
            this.showForm = false;
            this.fetchRoles();
            this.role = <Role>{};
          }
        }, err => {
          console.log("Error -> " + err.message);
        });
      }
    }).catch((err) => {
      console.log("Error -> " + err.message);
    });
  }

  private fetchRoles() {
    this.loading = true;
    this.roleService.fetch().subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.roles = res.data;
      }
    }, err => {
      this.loading = false;
      console.log("Error -> " + err.message);
    });
  }

  private fetchPermissions() {
    this.roleService.permissions().subscribe((res) => {
      if (res.success) {
        this.permissions = res.data;
      }
    }, err => {
      console.log("Error -> " + err.message);
    });
  }
}
