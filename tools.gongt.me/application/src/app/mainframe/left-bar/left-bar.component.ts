import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApplicationMenuCategorys, ApplicationRoutes } from '../../routing/routing.data';
interface IApp {
	id: string;
	title: string;
	icon?: string;
}
interface ICategory {
	id: string;
	title: string;
	icon?: string;
	applications: IApp[];
}

@Component({
	selector: 'g-left-bar',
	templateUrl: './left-bar.component.html',
	styleUrls: ['./left-bar.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class LeftBarComponent implements OnInit {
	readonly routes: ICategory[] = [];

	constructor() {
		const categorys: Record<string, ICategory> = {};
		for (const [id, { title, icon }] of Object.entries(ApplicationMenuCategorys)) {
			categorys[id] = { id, title, icon, applications: [] };
			this.routes.push(categorys[id]);
		}
		for (const item of ApplicationRoutes) {
			const { title, icon } = item.data!;
			const [category, id] = item.path!.split('/');

			categorys[category].applications.push({ id, title, icon });
		}
	}

	ngOnInit(): void {}
}
