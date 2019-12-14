import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HasilPage } from './hasil.page';

describe('HasilPage', () => {
  let component: HasilPage;
  let fixture: ComponentFixture<HasilPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HasilPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HasilPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
