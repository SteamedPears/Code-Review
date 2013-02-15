// vim: tabstop=4 noexpandtab textwidth=80

(function login_main() {
	$.getScript('https://login.persona.org/include.js', ready);
	$('#persona-login').click(function login_persona_click() {
		navigator.id.request();
		return false;
	});
	$('#persona-logout').click(function login_persona_click() {
		navigator.id.logout();
	});
	function ready() {
		navigator.id.watch({
			loggedInUser: null,
			onlogin: function (assertion) {
				console.log("Logged in: " + assertion);
				// This should pass the assertion on to the server.
			},
			onlogout: function () {
				console.log("Logged out.");
				// This should tell the server...
			}
		});
	}
})();

