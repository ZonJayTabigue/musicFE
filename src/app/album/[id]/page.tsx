"use client";
import Image from 'next/image';
import { Album } from '@/utils/constants/interfaces';
import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { getAlbum } from '@/utils/api/albums/getAlbum';

export default function AlbumPage() {
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const albumData = await getAlbum(Number(id));
        setAlbum(albumData);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };
    fetchAlbum();
  }, [id]);

  // Memoize the total duration calculation
  const totalDuration = useMemo(() => {
    if (!album?.tracks) return 0;

    return album.tracks.reduce((total, track) => {
      return total + Number(track.duration) / 60;
    }, 0);
  }, [album?.tracks]);

  if (!album) return <p>Loading...</p>;

  const totalMinutes = Math.floor(totalDuration);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return (
    <div className="container mx-auto mt-10 p-4">
      <div className="flex flex-col md:flex-row">
        {/* Fixed Info Section */}
        <div className="flex-shrink-0 w-full md:w-2/4 md:mr-6">
          <Image
            src={album.album_cover_xl}
            alt={album.album_title}
            width={700}
            height={700}
            className="w-full h-auto object-contain rounded-md mb-3"
            priority
          />
          <h1 className="text-3xl font-bold">{album.album_title}</h1>
          <p className="text-xl">{album.artist_name}</p>
          <p className="text-lg">
            Songs: {album.tracks.length} <span>&#8226;</span> {totalHours} {totalHours > 1 ? 'hours' : 'hour'} and {remainingMinutes} minutes
          </p>
          <p className="text-sm text-gray-500">Release: {new Date(album.release_date).toLocaleDateString()}</p>
        </div>

        {/* Track List Section */}
        <div className="md:ml-6 mt-4 md:mt-0 flex-grow">
          <h2 className="text-2xl font-semibold mt-6">Tracks</h2>
          {/* Scrollable Track List */}
          <div className="overflow-y-auto max-h-[80vh] scrollbar-hide mt-2"> {/* Reduced height for tracks list */}
            <ul>
              {album.tracks.map((track, index) => (
                <li key={index} className="py-2 border-b flex items-center justify-between">
                  <div>
                    <span className="block font-semibold">{track.title}</span>
                    <span className="text-gray-400 text-sm">Duration: {track.duration}</span>
                  </div>
                  {track.preview && (
                    <audio controls className="ml-4">
                      <source src={track.preview} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
