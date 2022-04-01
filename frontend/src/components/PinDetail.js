import {useState,useEffect} from "react";
import {useParams,useNavigate} from "react-router-dom";
import {MdDownloadForOffline} from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import {v4 as uuidv4} from "uuid";
import {client,urlFor} from "../client";
import MasonryLayout from "./MasonryLayout";
import {pinDetailMorePinQuery,pinDetailQuery} from "../utils/data";
import Spinner from "./Spinner";

const saveBtnClassNames = "bg-red-500 opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none transition-all duration-200 ease-in-out";
const downloadBtnClassNames = "bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-all duration-500 ease-in-out";
/* eslint-disable */
export default function PinDetail({user}) {
	const [pins,setPins] = useState([]);
	const [pinDetail,setPinDetail] = useState(null);
	const [comment,setComment] = useState("");
	const [addingComment,setAddingComment] = useState(false);
	const alreadySaved = pinDetail?.save?.filter(item => item?.postedBy?._id === user?._id)?.length;
	const saveStatus = alreadySaved ? "saved" : "save";
	const [saved,setSaved] = useState(saveStatus);
	const {pinId} = useParams();
	const navigate = useNavigate();

	const fetchPinDetail = () => {
		let query = pinDetailQuery(pinId);

		if(query) {
			client.fetch(query)
				.then(data => {
					setPinDetail(data[0]);

					if (data[0]) {
						query = pinDetailMorePinQuery(data[0]);

						client.fetch(query)
							.then(res => setPins(res))
							.catch(e => console.error("Fetch Related Pins Error: ",e));
					}
				})
				.catch(e => console.error("Fetch Pin Detail Error: ",e));
		}
	}

	const addCommentHandle = () => {
		if(comment) {
			setAddingComment(true);

			client.patch(pinId)
				.setIfMissing({comments: []})
				.insert("after","comments[-1]",[{
					comment,
					_key: uuidv4(),
					postedBy: {
						_type: "postedBy",
						_ref: user._id,
					},
				}])
				.commit()
				.then(() => {
					fetchPinDetail();
					setComment("");
					setAddingComment(false);
				})
				.catch(e => console.error("Patch Comment Error: ",e));
		}
	}

	const savePinHandle = e => {
		setSaved("saving");

		if(saved === "save") {
			client
				.patch(pinDetail?._id)
				.setIfMissing({save: []})
				.insert("after","save[-1]",[{
					_key: uuidv4(),
					userId: user?._id,
					postedBy: {
						_type: "postedBy",
						_ref: user?._id
					}
				}])
				.commit()
				.then(() => setSaved("saved"))
				.catch(e => console.error("Patch Save Pin Error: ",e));
		}
	}

	const deletePinHandle = e => {
		e.stopPropagation();
		client
			.delete(pinDetail?._id)
			.then(() => navigate("/"))
			.catch(e => console.log("Delete Pin Error: ",e));
	}

	useEffect(() => {
		const saveStatus = alreadySaved ? "saved" : "save";
		setSaved(saveStatus);
	},[alreadySaved]);

	useEffect(() => {
		fetchPinDetail();
	},[pinId]);

	if (!pinDetail) return <Spinner message="Loading pin..." />;

	return (
		<>
			<div className="flex xl-flex-row flex-col m-auto bg-white" style={{maxWidth: "1500px",borderRadius: "32px"}}>
				<div className="flex justify-center items-center md:items-start flex-initial">
					<img
						src={pinDetail?.image && urlFor(pinDetail.image).url()}
						className="rounded-t-3xl rounded-b-lg"
						alt="pin-img"
					/>
				</div>
				<div className="w-full p-5 flex-1 xl:min-w-620">
					<div className="flex items-center justify-between">
						<div className="flex gap-2">
							{pinDetail?.postedBy?._id === user?._id && (
								<button
									type="button"
									className={downloadBtnClassNames}
									onClick={deletePinHandle}
								>
									<AiTwotoneDelete />
								</button>
							)}
							<a
								href={`${pinDetail?.image?.asset?.url}?dl=`}
								download
								onClick={e => e.stopPropagation()}
								className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none transition-all duration-500 ease-in-out"
							>
								<MdDownloadForOffline />
							</a>
							{saved === "saved" ? (
								<button 
									type="button"
									className={saveBtnClassNames}
								>
									{pinDetail?.save?.length} Saved
								</button>
							) : (
								<button 
									onClick={savePinHandle}
									type="button" 
									className={saveBtnClassNames}
								>
									{saved === "saving" ? "Saving..." : "Save"}
								</button>
							)}
						</div>
							<a href={pinDetail?.destination} target="_blank" rel="noreferre">
								{pinDetail?.destination}
							</a>
					</div>
					<div>
						<h1 className="text-4xl font-bold break-words mt-3">
							{pinDetail?.title}
						</h1>
						<p className="mt-3">{pinDetail?.about}</p>
					</div>
					<div onClick={() => navigate(`/user-profile/${pinDetail?.postedBy?._id}`)} className="flex cursor-pointer gap-2 mt-5 items-center bg-white rounded-lg">
						<img
							className="w-8 h-8 rounded-full object-cover"
							src={pinDetail?.postedBy?.image}
							alt="user-profile"
						/>
						<p className="font-semibold capitalize">{pinDetail?.postedBy?.userName}</p>
					</div>
					<h2 className="mt-5 text-2xl">Comments</h2>
					<div className="max-h-370 overflow-y-auto">
						{pinDetail?.comments?.map((comment,i) => (
							<div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={i}>
								<img
									src={comment?.postedBy?.image}
									alt="user-profile"
									className="w-10 h-10 rounded-full cursor-pointer"
									onClick={() => navigate(`/user-profile/${comment?.postedBy?._id}`)}
								/>
								<div className="flex flex-col">
									<p className="font-bold">{comment?.postedBy?.userName}</p>
									<p>{comment?.comment}</p>
								</div>
							</div>
						))}
					</div>
					<div className="flex flex-wrap mt-5 gap-3">
						<img
							className="w-10 h-10 rounded-full cursor-pointer"
							src={user?.image}
							alt="user-profile"
							onClick={() => navigate(`/user-profile/${user?._id}`)}
						/>
						<input
							type="text"
							placeholder="Leave a comment"
							className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
							style={{width: "70%"}}
							value={comment}
							onChange={e => setComment(e.target.value)}
							onKeyDown={e => e.key === "Enter" && addCommentHandle()}
						/>
						<button
							type="text"
							className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
							onClick={addCommentHandle}
						>
							{addingComment ? "Posting..." : "Post"}
						</button>
					</div>
				</div>
			</div>
			{pins?.length > 0 && (
				<>
					<h2 className="text-center font-bold text-2xl mt-8 mb-4">
						More like this
					</h2>
					<MasonryLayout pins={pins} />
				</>
			)}
		</>
	);
}
