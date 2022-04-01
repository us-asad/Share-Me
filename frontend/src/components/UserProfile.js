import {useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {GoogleLogout} from "react-google-login";
import {AiOutlineLogout} from "react-icons/ai";
import {userCreatedPinsQuery,userQuery,userSavedPinsQuery} from "../utils/data";
import {client} from "../client";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner";

const randomImageUrl = "https://source.unsplash.com/1600x900/?nature,photography,technology";
const activeBtnStyles = "bg-red-500 text-white";
const notActiveBtnStyles = "bg-primary mr-4 text-black";

export default function UserProfile() {
	const [user,setUser] = useState(null);
	const [pins,setPins] = useState([]);
	const [text,setText] = useState("Created");
	const [activeBtn,setActiveBtn] = useState("created");
	const navigate = useNavigate();
	const {userId} = useParams();

	const logoutSuccessHandle = () => {
		localStorage.clear();

		navigate("/login");
	}

	const btnHandle = (e,value) => {
		setText(e.target.textContent);
		setActiveBtn(value);
	}

	useEffect(() => {
		const query = userQuery(userId);

		client.fetch(query)
			.then(data => setUser(data[0]))
			.catch(e => console.error("Fetch User Profile Error: ",e))
	},[userId]);

	useEffect(() => {
		if (text === "Created") {
			const createdPinsQuery = userCreatedPinsQuery(userId);

			client.fetch(createdPinsQuery)
				.then(data => setPins(data))
				.catch(e => console.error("Fetch Created Pins Error: ",e));
		} else {
			const savedPinsQuery = userSavedPinsQuery(userId);

			client.fetch(savedPinsQuery)
				.then(data => setPins(data))
				.catch(e => console.error("Fetch Created Pins Error: ",e));
		}
	},[text,userId]);

	if (!user) return <Spinner message="Loading profile..." />;

	return (
		<div className="relative p-2 h-full justify-center items-center">
			<div className="flex flex-col pb-5">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center">
						<img
							src={randomImageUrl}
							className="w-full h-370 2xl:h-510 shadow-lg object-cover"
							alt="banner-pic"
						/>
						<img
							className="rounded-full w-20 h20 -mt-10 shadow-xl object-cover"
							src={user?.image}
							alt="user-img"
						/>
						<h1 className="font-bold text-3xl text-center mt-3">
							{user?.userName}
						</h1>
						<div className="absolute top-0 z-1 right-0 p-2">
							{userId === user._id && (
								<GoogleLogout
									clientId="893105973507-s3fqrbp6qqj1sva7f1ph8ku8o58t8ro4.apps.googleusercontent.com"
									render={renderProps => (
										<button
											type="button"
											className="bg-white p-2 rounded-full cursor-pointer outline-none shadow-md"
											onClick={renderProps.onClick}
											disabled={renderProps.disabled}
										>
											<AiOutlineLogout color="red" fontSize={21} />
										</button>
									)}
									onLogoutSuccess={logoutSuccessHandle}
									cookiePolicy="single_host_origin"
								/>
							)}
						</div>
					</div>
					<div className="text-center mb-7">
						<button
							type="button"
							onClick={e => btnHandle(e,"created")}
							className={`${activeBtn === "created" ? activeBtnStyles : notActiveBtnStyles} font-bold p-2 rounded-full w-20 outline-none`}
						>
							Created
						</button>
						<button
							type="button"
							onClick={e => btnHandle(e,"saved")}
							className={`${activeBtn === "saved" ? activeBtnStyles : notActiveBtnStyles} font-bold p-2 rounded-full w-20 outline-none`}
						>
							Saved
						</button>
					</div>
					{pins?.length ? (
						<div className="px-2">
							<MasonryLayout pins={pins} />
						</div>
					) : (
						<div className="flex justify-center font-bold items-center w-full text-xl mt-2">
							No Pins Found!
						</div>
					)}
				</div>
			</div>
		</div>
	);
}