import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsettingsComponent } from './streamsettings.component';

describe('StreamsettingsComponent', () => {
  let component: StreamsettingsComponent;
  let fixture: ComponentFixture<StreamsettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamsettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
