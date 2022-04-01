import {NavLink,Link} from "react-router-dom";
import {RiHomeFill} from "react-icons/ri";
import {categories} from "../utils/data";
import logo from "../assets/logo.png";

const isNotActiveStyle = "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize"
const isActiveStyle = "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize"


export default function Sidebar({user,closeToogle}) {
	const handleCloseSidebar = () => {
		if (closeToogle) closeToogle(false);
	}

	return (
		<div className="flex flex-col justify-between bg-white h-full overflow-y-scrikk min-w-210 hide-scroll">
			<div className="flex flex-col">
				<Link 
					to="/"
					className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
					onClick={handleCloseSidebar}
				>
					<img src={logo} alt="share me" className="w-full" />
				</Link>
				<div className="flex flex-col gap-5">
					<NavLink
						to="/"
						className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}
						onClick={handleCloseSidebar}
					>
						<RiHomeFill />
						Home
					</NavLink>
					<h3 className="mt-2 px-5 text-base 2xl:text-xl">Discover categories</h3>
					{categories.slice(0,categories.length - 1).map(category => (
						<NavLink
							key={category.name}
							to={`/category/${category.name}`}
							className={({isActive}) => isActive ? isActiveStyle : isNotActiveStyle}
							onClick={handleCloseSidebar}
						>
							<img src={category?.image} className="w-8 h-8 rounded-full shadow-sm" alt="category-pic" />
							{category.name}
						</NavLink>
					))}
				</div>
			</div>
			{user && (
				<Link
					to={`user-profile/${user._id}`}
					className="flex my-5 mb-3 gap-2 items-center bg-white rounded-lg shadow-lg mx-3"
					onClick={handleCloseSidebar}
				>
					<img src={user?.image} className="w-10 h-10 rounded-full" alt="user-profile" />
					<p>{user.userName}</p>
				</Link>
			)}
		</div>
	);
}