import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HashRoutingModule } from './hash-routing.module';
import { HashComponent } from './hash.component';

@NgModule({
	declarations: [HashComponent],
	imports: [CommonModule, HashRoutingModule],
	exports: [HashComponent],
})
export class HashModule {}
