export const fetchUser = () => {
	const user = localStorage.getItem("user");

	if (user !== "undefined") return JSON.parse(user);
	else {
		localStorage.clear();
		return null
	}
}
