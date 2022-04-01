import { useState, useEffect } from "react";
import { useParams } from  "react-router-dom";
import { client } from "../client";
import { searchQuery, feedQuery } from "../utils/data";
import MasonryLayout from "./MasonryLayout";
import Spinner from "./Spinner"

export default function Feed() {
	const [loading, setLoading] = useState(false);
	const [pins, setPins] = useState([]);
	const { categoryId } = useParams();

	const fetchData = () => {
		setLoading(true);

		if (categoryId) {
			const query = searchQuery(categoryId);

			client.fetch(query)
				.then(data => {
					setPins(data);
					setLoading(false);
				})
				.catch(e => console.error("Fetch Category Pins Error: ",e));
		} else {
			client.fetch(feedQuery)
				.then(data => {
					setPins(data);
					setLoading(false);
				})
				.catch(e => console.error("Fetch Category Pins Error: ",e));
		}
	}

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	},[categoryId]);

	if (loading) return <Spinner message="We are adding new ideas to your feed!" />;
	else if (!pins?.length) return <h2 className="text-center mt-3">No pins</h2>;

	return (
		<div>
			{pins && <MasonryLayout fetchData={fetchData} pins={pins} />}
		</div>
	);
}