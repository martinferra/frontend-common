import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';

import { AuthService, UserInfo } from '../../shared/services';
import { ControlValidator, FormValidator } from '../../appValidators';
import { environment } from '../../environments/environment';
import { AuthComponentsUtilsService } from '../auth-components-utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.component.scss'],
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule
  ],
})
export class LoginComponent {
  emailCtrl: FormControl = new FormControl(null);
  emailValidator!: ControlValidator;

  passwordForm: FormGroup = this.formBuilder.group({
    password: null,
    repeatPassword: null,
  });
  passwordValidator!: FormValidator;

  userInfo: UserInfo | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private authComponentsUtilsService: AuthComponentsUtilsService
  ) {
    this.initializeForm();
  }

  private initializeForm() {
    this.initializeFormValidator();
    this.subscribeToChanges();
  }

  private initializeFormValidator() {
    this.emailValidator = this.authComponentsUtilsService.getEmailValidator(
      this.emailCtrl,
      false,
      (userInfo: UserInfo) => (this.userInfo = userInfo)
    );

    this.passwordValidator =
      this.authComponentsUtilsService.getPasswordValidator(this.passwordForm);
  }

  private subscribeToChanges() {
    this.emailCtrl.valueChanges.subscribe((email: string) => {
      if (!this.emailCtrl.touched && this.emailCtrl.dirty) {
        this.emailCtrl.updateValueAndValidity({ emitEvent: false });
      }
    });
    this.passwordForm
      .get('password')
      ?.valueChanges.subscribe((password: string) => {
        this.passwordForm.get('repeatPassword')?.updateValueAndValidity();
      });
  }

  login(): void {
    this.authService
      .login(this.emailCtrl.value, this.passwordForm.get('password')?.value)
      .subscribe(() => {
        this.router.navigateByUrl('/');
      });
  }

  get showRegisterLink(): boolean {
    return !environment.production;
  }

  get email(): string {
    return this.emailCtrl.value;
  }

  get mustRepeatPassword(): boolean {
    return !!this.userInfo?.blankedPassword;
  }

  get disableLoginButton(): boolean {
    return (
      !this.passwordForm.get('password')?.valid ||
      (this.mustRepeatPassword &&
        !this.passwordForm.get('repeatPassword')?.valid)
    );
  }
}
