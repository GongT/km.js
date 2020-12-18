import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LvmCacheCalcComponent } from './lvm-cache-calc.component';

const routes: Routes = [{ path: '', component: LvmCacheCalcComponent }];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class LvmCacheCalcRoutingModule {}
