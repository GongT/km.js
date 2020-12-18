import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LvmCacheCalcRoutingModule } from './lvm-cache-calc-routing.module';
import { LvmCacheCalcComponent } from './lvm-cache-calc.component';

@NgModule({
	declarations: [LvmCacheCalcComponent],
	imports: [CommonModule, LvmCacheCalcRoutingModule],
	exports: [LvmCacheCalcComponent],
})
export class LvmCacheCalcModule {}
