import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'g-top-bar',
	templateUrl: './top-bar.component.html',
	styleUrls: ['./top-bar.component.scss'],
	encapsulation: ViewEncapsulation.None,
})
export class TopBarComponent implements OnInit, OnDestroy {
	constructor() {}

	ngOnDestroy() {}
	ngOnInit(): void {}
}
