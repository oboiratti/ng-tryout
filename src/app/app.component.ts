import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

interface IMenuItem {
  label: string
  route: string
  icon: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  menus: IMenuItem[];
  username: string;
  email: string;
  loading: boolean;

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.setMenuItems();
    this.setUsername();
  }

  isLoggedIn() {
    this.setUsername();
    return this.authService.isLoggedIn();
  }

  setUsername() {
    let user = this.authService.currentUser;
    if (user) {
      this.username = user.name;
      this.email = user.email
    }
  }

  logout() {
    this.loading = true;
    this.authService.invalidate().subscribe((res) => {
      this.loading = false;
      if (res.success) {
        this.authService.removeUser();
        this.router.navigate(['/login']);
      }
    });
  }

  private setMenuItems() {
    this.menus = [
      { label: "Dashboard", route: "/dashboard", icon: "fa fa-dashboard fa-lg" },
      { label: "Settings", route: "/settings", icon: "fa fa-cogs fa-lg text-primary" },
      { label: "Admin", route: "/admin", icon: "fa fa-key fa-lg text-warning" },
      { label: "Users", route: "/users", icon: "fa fa-users fa-lg text-danger" },
      { label: "Roles", route: "/roles", icon: "fa fa-cubes fa-lg text-success" }
    ];
  }
}
