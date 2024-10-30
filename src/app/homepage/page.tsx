import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllAlbums } from '@/utils/api/albums/getAll';
import AlbumCard from '../../components/albumCard';
import { Album } from '@/utils/constants/interfaces';
import { searchAlbums } from '@/utils/api/albums/searchAlbums';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAlbums } from '@/store/slices/albumSlice';

export default function HomePage() {
  const albums = useSelector((state: RootState) => state.albums.albums);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;

  // Fetch albums based on page and search term
  const fetchAndStoreAlbums = async (search: string) => {
    try {
      const albumsData = search
        ? await searchAlbums(search, page, limit)
        : await getAllAlbums(page, limit);

      dispatch(setAlbums(albumsData));
      setHasMore(albumsData?.length === limit);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  // Effect for fetching initial data when page changes
  useEffect(() => {
    if (page > 0) {
      fetchAndStoreAlbums(searchTerm);
    }
  }, [page, dispatch]);

  const handleSearch = async () => {
    setPage(1); // Reset to page 1 on search
    await fetchAndStoreAlbums(searchTerm);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6">Albums</h1>

      <div className="flex items-center justify-center gap-2 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search albums or artists..."
          className="p-2 border border-gray-300 rounded-md w-1/4"
        />
        <button
          onClick={handleSearch}
          className="p-2 bg-blue-500 text-white rounded-md"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albums?.map((album: Album) => (
          <Link href={`/album/${album.id}`} key={album.id} className="group block p-4 border rounded-lg shadow-md hover:bg-gray-100">
            <AlbumCard  
              albumCover={album.album_cover_big}
              albumTitle={album.album_title}
              artistName={album.artist_name}
              releaseDate={album.release_date}
            />
          </Link>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={handleNextPage}
          disabled={!hasMore}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
