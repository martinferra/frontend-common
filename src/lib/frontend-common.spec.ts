import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrontendCommon } from './frontend-common';

describe('FrontendCommon', () => {
  let component: FrontendCommon;
  let fixture: ComponentFixture<FrontendCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FrontendCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FrontendCommon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
