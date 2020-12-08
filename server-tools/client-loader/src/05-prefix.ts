Object.assign(window, {
	__window_init_state: Object.keys(window),
});
const pageLoadStartAt = new Date().getTime();
// a
if (console && console.groupCollapsed) {
	console.groupCollapsed('==================== BOOTSTRAP ====================');
}

function bootstrapComplete() {
	if (console && console.groupCollapsed) {
		console.groupEnd();
	}
}
