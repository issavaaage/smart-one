import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeIconModalComponent} from './change-icon-modal.component';

describe('ChangeIconModalComponent', () => {
  let component: ChangeIconModalComponent;
  let fixture: ComponentFixture<ChangeIconModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeIconModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangeIconModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
