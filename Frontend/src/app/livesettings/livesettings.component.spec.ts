import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivesettingsComponent } from './livesettings.component';

describe('LivesettingsComponent', () => {
  let component: LivesettingsComponent;
  let fixture: ComponentFixture<LivesettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LivesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
