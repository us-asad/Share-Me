import {useState,useRef,useEffect} from "react";
import {HiMenu} from "react-icons/hi";
import {AiFillCloseCircle} from "react-icons/ai";
import {Link,Route,Routes} from "react-router-dom";
import {Sidebar, UserProfile} from "../components";
import Pins from "./Pins";
import {client} from "../client";
import logo from "../assets/logo.png";
import {userQuery} from "../utils/data";
import {fetchUser} from "../utils/fetchUser";

export default function Home() {
	const [toogleSidebar,setToggleSidebar] = useState(false);
	const [user,setUser] = useState(null);
	const scrollRef = useRef(null);
	const userInfo = fetchUser();

	useEffect(() => {
		const query = userQuery(userInfo?.googleId);

		client.fetch(query)
			.then(data => setUser(data[0]))
			.catch(e => console.error("Fetch User Error: ",e));
			// eslint-disable-next-line
	},[]);

	useEffect(() => {
		scrollRef.current.scrollTo(0,0);
	},[]);

	return (
		<div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out">
			<div className="hidden md:flex h-screen flex-initial">
				<Sidebar user={user && user} />
			</div>
			<div className="flex md:hidden flex-row">
				<div className="p-2 w-full flex flex-row justify-between items-center shadow-md">	
					<HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
					<Link to="/">
						<img src={logo} alt="share me" className="w-28" />
					</Link>
					<Link to={`user-profile/${user?._id}`}>
						<img src={user?.image} alt="you" className="rounded-full" style={{width: "3rem"}} />
					</Link>
				</div>
				{toogleSidebar && (
					<div className="fixed w-3/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
						<div className="absolute w-full flex justify-end items-center p-2">
							<AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
						</div>
						<Sidebar user={user && user} closeToggle={setToggleSidebar} />
					</div>
				)}
			</div>
			<div className="pb-2 flex-1 h-screen overflow-y-auto" ref={scrollRef}>
				<Routes>
					<Route path="/user-profile/:userId" element={<UserProfile />} />
					<Route path="/*" element={<Pins user={user && user} />} />
				</Routes>
			</div>
		</div>
	);
}
