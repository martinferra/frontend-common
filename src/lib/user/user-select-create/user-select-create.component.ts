import { Component, forwardRef } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Observable } from 'rxjs';
import { UserService } from '../../models/user/user.service';
import { UserNewEditDialogWrapperComponent } from '../../users/user-new-edit/user-new-edit.component';
import { User } from '../../models/user/user.model';
import { BasicAutocompletedInputComponent } from '../../basic-autocompleted-input/basic-autocompleted-input.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-user-select-create',
  templateUrl: '../../basic-autocompleted-input/basic-autocompleted-input.component.html',
  styleUrls: ['../../basic-autocompleted-input/basic-autocompleted-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSelectCreateComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatAutocompleteModule
  ],
})
export class UserSelectCreateComponent extends BasicAutocompletedInputComponent<User> {
  requiredErrorMessage = 'El usuario es requerido';
  placeholder = 'Propietario/a';
  panelWidth = '300px';

  constructor(
    public dialog: MatDialog,
    private userService: UserService
  ) {
    super(dialog);
  }

  protected get initialValue(): any {
    return '';
  }

  protected get minIndividualLength(): number {
    return 1;
  }

  protected get minGlobalLength(): number {
    return 1;
  }

  protected filterElements(query: any): Observable<any[]> {
    return this.userService.findAutocompleteOptions(query);
  }

  protected get displayInnerElementInInputFn(): any {
    return (user: User) => (user ? `${user.fullname} (${user.email})` : '');
  }

  protected get displayElementInListFn(): any {
    return (user: User) => (user ? `${user.fullname} (${user.email})` : '');
  }

  protected getNewElementFromQuery(queryStr: any): any {
    return this.userService.getMainEntityClass().newFromQuery(queryStr);
  }

  protected get editorComponentClass(): any {
    return UserNewEditDialogWrapperComponent;
  }
}
