import {useState,useEffect} from "react";
import MasonryLayout from "./MasonryLayout";
import {client} from "../client";
import {feedQuery,searchQuery} from "../utils/data";
import Spinner from "./Spinner";

export default function Search({searchTerm}) {
	const [pins,setPins] = useState(null);
	const [loading,setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm) {
			setLoading(true);
			const query = searchQuery(searchTerm.toLowerCase().trim());

			client.fetch(query)
				.then(data => {
					setPins(data);
					setLoading(false);
				})
				.catch(e => console.error("Fetch Search Pins Error: ",e));
		} else {
			client.fetch(feedQuery)
				.then(data => {
					setPins(data);
					setLoading(false);
				})
				.catch(e => console.error("Fetch Feed Pins Error: ",e));
		}
	},[searchTerm]);

	return (
		<div>
			{loading && <Spinner message="Searching for pins..." />}
			{pins?.length ? <MasonryLayout pins={pins} /> : null}
			{!pins?.length && searchTerm && !loading && (
				<div className="mt-10 text-center text-xl">No Pins Found!</div>
			)}
		</div>
	);
}