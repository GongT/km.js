import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'g-welcome',
	templateUrl: './welcome.component.html',
	styleUrls: ['./welcome.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class WelcomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
