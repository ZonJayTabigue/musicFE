import Link from 'next/link';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { getAllAlbums } from '@/utils/api/albums/getAll';
import { Album } from '@/utils/constants/interfaces';
import { searchAlbums } from '@/utils/api/albums/searchAlbums';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setAlbums, addAlbums } from '@/store/slices/albumSlice';

const AlbumCard = dynamic(() => import('../../components/albumCard'));

export default function HomePage() {
  const albums = useSelector((state: RootState) => state.albums.albums);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const limit = 12;
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch albums based on page and search term
  const fetchAndStoreAlbums = async (search: string, reset: boolean = false, isSearch: boolean = false) => {
    // setLoading(true);
    try {
      const albumsData = isSearch
        ? await searchAlbums(search, page, limit)
        : await getAllAlbums(page, limit);

      const albumsToDispatch = albumsData || [];

      if (reset) {
        dispatch(setAlbums(albumsToDispatch));
      } else {
        dispatch(addAlbums(albumsToDispatch));
      }

      setHasMore(albumsToDispatch.length === limit);
    } catch (error) {
      console.error("Error fetching albums:", error);
    }
  };

  useEffect(() => {
    if (page > 0) {
      fetchAndStoreAlbums(searchTerm, page === 1);
    }
  }, [page]);

  const handleSearch = async () => {
    setPage(1);
    setLoading(true);
    await fetchAndStoreAlbums(searchTerm, true, true);
    setLoading(false);
  }

  const lastAlbumRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Albums {loading}</h1>
  
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="relative w-1/4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search albums or artists..."
            className="p-2 pr-8 border border-gray-300 rounded-md w-full bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
          />
          
          <button
            onClick={() => {
              setSearchTerm('');
              fetchAndStoreAlbums('', true, false);
            }}
            hidden={!searchTerm}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            &times;
          </button>
        </div>
        <button
          onClick={handleSearch}
          hidden={!searchTerm}
          className="p-2 bg-violet-500 text-white rounded-md hover:bg-violet-600 dark:bg-violet-700 dark:hover:bg-violet-600"
        >
          Search
        </button>
      </div>
  
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <span className="text-lg">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums?.map((album: Album, index: number) => {
            const isLastAlbum = index === albums.length - 1;
            return (
              <div
                key={album.id}
                ref={isLastAlbum ? lastAlbumRef : null}
              >
                <Link
                  href={`/album/${album.id}`}
                  className="group block p-4 border rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Suspense fallback={<div>Loading...</div>}>
                    <AlbumCard  
                      albumCover={album.album_cover_big}
                      albumTitle={album.album_title}
                      artistName={album.artist_name}
                      releaseDate={album.release_date}
                    />
                  </Suspense>
                </Link>
              </div>
            );
          })}
        </div>
      )}
  
      <button 
        onClick={scrollToTop} 
        className="fixed bottom-4 right-4 bg-violet-500 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-violet-600 dark:bg-violet-700 dark:hover:bg-violet-600 transition duration-300"
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
}
