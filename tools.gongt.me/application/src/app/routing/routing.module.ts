import { NgModule } from '@angular/core';
import { Data, Route, RouterModule } from '@angular/router';
import { camelCase, ucfirst } from '@idlebox/common';
import { NotFoundComponent } from '../pages/not-found/not-found.component';
import { WelcomeComponent } from '../pages/welcome/welcome.component';
import { ApplicationRoutes } from './routing.data';

export interface IMyRouteData {
	title: string;
	icon?: string;
}

interface ExtendedRoute extends Route {
	data: IMyRouteData & Data;
}

export type ExtendedRoutes = ExtendedRoute[];

for (const route of ApplicationRoutes) {
	route.pathMatch = 'full';
	route.data!.animation = 'App' + ucfirst(camelCase(route.path!.replace('/', '_')));
}

const r = [
	{ path: '', pathMatch: 'full', component: WelcomeComponent, data: { animation: 'IndexPage' } },
	...ApplicationRoutes,
	{ path: '', component: NotFoundComponent, data: { animation: 'Error404Page' } },
];
console.log('ApplicationRoutes: %o', r);

@NgModule({
	imports: [RouterModule.forRoot(r)],
	exports: [RouterModule],
	declarations: [],
})
export class RoutingModule {}
