import { Component, EventEmitter, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter-handler',
  templateUrl: './filter-handler.component.html',
  styleUrls: ['./filter-handler.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
})
export class FilterHandlerComponent {
  @Output() toggleFilterViewEmitter: EventEmitter<any> = new EventEmitter();

  constructor() {}

  toggleFilterView(): void {
    this.toggleFilterViewEmitter.emit(null);
  }

  public updateFilter(): void {}
}
