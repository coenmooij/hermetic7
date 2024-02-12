import { NgModule } from '@angular/core';
import { HomePage } from './home';
import { NgIf } from '@angular/common';

const PAGES = [HomePage];

@NgModule({
  declarations: PAGES,
  imports: [
    NgIf
  ],
  exports: PAGES
})
export class PagesModule {}
