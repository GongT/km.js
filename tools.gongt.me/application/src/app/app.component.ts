import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { opacitySwitchAnimation } from './animations/opacity-switch.animation';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	animations: [opacitySwitchAnimation],
})
export class AppComponent implements OnInit, OnDestroy {
	public loadingRouteConfig: boolean = false;
	private dispose?: Subscription;

	constructor(private readonly router: Router) {}

	ngOnDestroy() {
		this.dispose?.unsubscribe();
	}
	ngOnInit(): void {
		this.dispose = this.router.events.subscribe((event) => {
			if (event instanceof RouteConfigLoadStart) {
				this.loadingRouteConfig = true;
			} else if (event instanceof RouteConfigLoadEnd) {
				this.loadingRouteConfig = false;
			}
		});
	}

	prepareRoute(outlet: RouterOutlet) {
		return (outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation) || '_void_';
	}
}
