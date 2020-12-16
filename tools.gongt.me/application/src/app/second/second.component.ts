import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-second',
	template: ` <p>second really works!</p> `,
	styles: [],
})
export class SecondComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
