import { animate, AnimationTriggerMetadata, query, sequence, style, transition, trigger } from '@angular/animations';

const resetRoute = [
	style({ position: 'relative' }),
	query(
		':enter, :leave',
		[
			style({
				// position: 'absolute', // using absolute makes the scroll get stuck in the previous page's scroll position on the new page
				top: 0, // adjust this if you have a header so it factors in the height and not cause the router outlet to jump as it animates
				left: 0,
				width: '100%',
				opacity: 0,
			}),
		],
		{ optional: true }
	),
];

export const opacitySwitchAnimation: AnimationTriggerMetadata = trigger('routeFadeAnimation', [
	transition('_void_ => *', []),
	transition('* => _void_', []),
	transition('* => *', [
		...resetRoute,
		query(':enter', [style({ opacity: 0 })]),
		sequence([
			query(':leave', [
				style({ opacity: 1, display: 'block' }),
				animate('100ms', style({ opacity: 0 })),
				style({ position: 'absolute', left: '1000%' }),
			]),
			animate('50ms'),
			query(':enter', [style({ opacity: 0, display: 'block' }), animate('100ms', style({ opacity: 1 }))]),
		]),
	]),
]);
