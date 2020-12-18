import { Component, Input, OnChanges, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'g-icon',
	template: `
		<ng-template ngIf="svgIcon">
			<mat-icon matListIcon [svgIcon]="svgIcon"></mat-icon>
		</ng-template>
		<ng-template #elseBlock>
			<mat-icon matListIcon>{{ ligaIcon }}</mat-icon>
		</ng-template>
	`,
	styleUrls: ['./icon.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class IconComponent implements OnInit, OnChanges {
	@Input()
	declare readonly icon: string;

	svgIcon: string = '';
	ligaIcon: string = '';

	constructor() {}

	ngOnInit(): void {}

	ngOnChanges(): void {
		if (!this.icon) {
			this.svgIcon = '';
			this.ligaIcon = '';
		} else if (this.icon.startsWith('svg:')) {
			this.svgIcon = '';
			this.svgIcon = this.icon.slice(4);
		} else {
			this.ligaIcon = this.icon;
			this.ligaIcon = '';
		}
	}
}
