import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditComponentComponent } from './edit-component.component';

describe('EditComponentComponent', () => {
  let component: EditComponentComponent;
  let fixture: ComponentFixture<EditComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditComponentComponent]
    });
    fixture = TestBed.createComponent(EditComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
