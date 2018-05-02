import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesettingsComponent } from './profilesettings.component';

describe('ProfilesettingsComponent', () => {
  let component: ProfilesettingsComponent;
  let fixture: ComponentFixture<ProfilesettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfilesettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilesettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
