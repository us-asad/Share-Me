import {useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";

import {client,urlFor} from "../client";
import {fetchUser} from "../utils/fetchUser";

const saveBtnClassNames = "bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none transition-all duration-200 ease-in-out";
const downloadBtnClassNames = "bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-all duration-500 ease-in-out";

export default function Pin({fetchData,pin: {postedBy, image, _id, destination, save}}) {
	const [postHovered,setPostHovered] = useState(false);
	const navigate = useNavigate();
	const user = fetchUser();
	const alreadySaved = save?.filter(item => item?.postedBy?._id === user?.googleId)?.length;

	const savePinHandle = e => {
		e.stopPropagation();
		
		if(!alreadySaved) {
			client
				.patch(_id)
				.setIfMissing({save: []})
				.insert("after","save[-1]",[{
					_key: uuidv4(),
					userId: user?.googleId,
					postedBy: {
						_type: "postedBy",
						_ref: user?.googleId
					}
				}])
				.commit()
		}
	}

	const deletePinHandle = e => {
		e.stopPropagation();

		client
			.delete(_id)
			.then(() => fetchData());
	}

	return (
		<div className="m-2">
			<div
				onMouseEnter={() => setPostHovered(true)}
				onMouseLeave={() => setPostHovered(false)}
				onClick={() => navigate(`/pin-detail/${_id}`)}
				className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg oveflow-hidden transition-all duration-500 ease-in-out"
			>
				<img className="rounded-lg w-full" alt="user-post" src={urlFor(image).width(250).url()} />
				{postHovered && (
					<div
						className="absolute top-0 w-full h-full flex flex-col justify-between pl-1 pr-2 py-2 z-50"
						style={{height: "100%"}}
					>
						<div className="flex items-center justify-between">
							<div className="flex gap-2">
								<a
									href={`${image?.asset?.url}?dl=`}
									download
									onClick={e => e.stopPropagation()}
									className={downloadBtnClassNames}
								>
									<MdDownloadForOffline />
								</a>
							</div>
							{alreadySaved ? (
								<button 
									type="button"
									className={saveBtnClassNames}
								>
									{save?.length} Saved
								</button>
							) : (
								<button 
									onClick={savePinHandle}
									type="button" 
									className={saveBtnClassNames}
								>
									Save
								</button>
							)}
						</div>
						<div className="flex justify-between items-center gap-2 w-full">
							{destination && (
								<a
									href={destination}
									target="_blank"
									rel="noreferrer"
									onClick={e => e.stopPropagation()}
									className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md transition-all duration-200 ease-in-out"
								>
									<BsFillArrowUpRightCircleFill />
									{destination.length > 8 ? `${destination?.slice(0,8)}...` : destination}
								</a>
							)}
							{postedBy?._id === user.googleId && (
								<button
									type="button"
									className={downloadBtnClassNames}
									onClick={deletePinHandle}
								>
									<AiTwotoneDelete />
								</button>
							)}
						</div>
					</div>
				)}
			</div>
			<Link to={`/user-profile/${postedBy?._id}`} className="flex gap-2 mt-2 items-center">
				<img
					className="w-8 h-8 rounded-full object-cover"
					src={postedBy?.image}
					alt="user-profile"
				/>
				<p className="font-semibold capitalize">{postedBy?.userName}</p>
			</Link>
		</div>
	);
}
