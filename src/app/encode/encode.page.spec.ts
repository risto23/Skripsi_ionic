import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncodePage } from './encode.page';

describe('EncodePage', () => {
  let component: EncodePage;
  let fixture: ComponentFixture<EncodePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncodePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
