import { useState } from "react";

import Navbar from "./Navbar";
import NumResults from "./NumResults";
import Search from "./Search";
import Main from "./Main";
import Box from "./Box";
import Loader from "./Loader";
import MovieList from "./MovieList";
import ErrorMessage from "./ErrorMessage";
import MovieDetails from "./MovieDetails";
import WatchedSummary from "./WatchedSummary";
import WatchedMoviesList from "./WatchedMoviesList";

import { useMovies } from "../useMovies";
import { useLocalStorageState } from "../useLocalStorageState";

export default function App() {
	const [query, setQuery] = useState("");
	const [selectedId, setSelectedId] = useState(null);

	const { movies, isLoading, error } = useMovies(query);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	return (
		<>
			<Navbar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{!isLoading && !error && (
						<MovieList
							movies={movies}
							onSelectMovie={handleSelectMovie}
						/>
					)}
					{error && <ErrorMessage message={error} />}
				</Box>

				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}
