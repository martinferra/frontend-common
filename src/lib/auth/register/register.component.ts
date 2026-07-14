import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../shared/services';
import { SharedConfigService } from '../../shared/services/shared-config/shared-config.service';
import { map, Observable } from 'rxjs';
import { FormValidator } from '../../appValidators';
import { AuthComponentsUtilsService } from '../auth-components-utils.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class RegisterComponent {
  userForm = this.formBuilder.group({
    fullname: null,
    email: null,
    password: null,
    repeatPassword: null,
  });
  userFormValidator: FormValidator =
    this.authComponentsUtilsService.getRegisterValidator(this.userForm);

  constructor(
    private router: Router,
    public authService: AuthService,
    private sharedConfigService: SharedConfigService,
    private formBuilder: FormBuilder,
    private authComponentsUtilsService: AuthComponentsUtilsService
  ) {
    this.subscribeToChanges();
  }

  private subscribeToChanges() {
    this.userForm
      .get('password')
      ?.valueChanges.subscribe(() => {
        this.userForm.get('repeatPassword')?.updateValueAndValidity();
      });
  }

  get allowUserRegistration$(): Observable<boolean> {
    return this.sharedConfigService
      .getSharedConfig()
      .pipe(
        map((sharedConfig: any) => Boolean(sharedConfig.allowUserRegistration))
      );
  }

  register(): void {
    const { fullname, email, password, repeatPassword } =
      this.userForm.getRawValue();

    if (!(fullname && email)) return;

    this.allowUserRegistration$.subscribe((allowUserRegistration: boolean) => {
      if (allowUserRegistration) {
        if (!(password && repeatPassword)) return;
        this.authService
          .register(fullname, email, password, repeatPassword)
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      } else {
        this.authService.addRegistrationReq(fullname, email).subscribe();
        alert('Su solicitud de registro fue enviada');
        this.userForm.reset();
      }
    });
  }

  get disableRegisterButton$(): Observable<{ value: boolean }> {
    return this.allowUserRegistration$.pipe(
      map((allowUserRegistration: boolean) => {
        return allowUserRegistration
          ? !this.userForm.valid
          : !Boolean(this.userForm.get('email')?.valid) ||
              !Boolean(this.userForm.get('fullname')?.valid);
      }),
      map((value: boolean) => {
        return { value };
      })
    );
  }
}
