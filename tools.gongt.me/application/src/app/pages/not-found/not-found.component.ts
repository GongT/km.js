import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'g-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class NotFoundComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
