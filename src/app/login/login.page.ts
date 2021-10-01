import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../core/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      username: this.fb.control('cesar.borges', [Validators.required]),
      password: this.fb.control('@Dj.91344356', [Validators.required]),
      remember: this.fb.control(true, [Validators.required]),
    });
  }

  ngOnInit() {
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.form.disable();
      this.loading = true;
      this.authService.login(this.form.value).subscribe(
        response => {
          if (this.form.get('remember').value === true) {
            localStorage.setItem('$jsghf478==', btoa(JSON.stringify(this.form.value)));
          }
          this.form.enable();
          this.router.navigate(['/home']);
          this.loading = false;
        },
        error => {
          console.log(error);
          this.form.enable();
          this.loading = false;
        }
      );
    }
  }
}
