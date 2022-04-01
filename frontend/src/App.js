import {useEffect} from "react";
import {Routes,Route,useNavigate} from "react-router-dom";
import Home from "./container/Home";
import {Login} from "./components";
import {fetchUser} from "./utils/fetchUser";

export default function App() {
	const navigate = useNavigate();
	const user = fetchUser();

	useEffect(() => {
		if (!user && !user?.googleId) {
			navigate("/login");
		}
		// eslint-disable-next-line
	},[]);

    return (
    	<Routes>
    		<Route path="login" element={<Login />} />
    		<Route path="/*" element={<Home />} />
    	</Routes>
    );
}