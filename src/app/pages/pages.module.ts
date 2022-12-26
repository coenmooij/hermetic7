import { NgModule } from '@angular/core';
import { HomePage } from './home';

const PAGES = [HomePage];

@NgModule({
  declarations: PAGES,
  exports: PAGES
})
export class PagesModule {}
