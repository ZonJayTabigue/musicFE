
import Image from 'next/image';

interface AlbumCardProps {
  albumCover: string;
  albumTitle: string;
  artistName: string;
  releaseDate: string;
}

export default function AlbumCard({ albumCover, albumTitle, artistName, releaseDate }: AlbumCardProps) {
  return (
    <div className="max-w-sm hover:inherit transition-shadow duration-300">
      {/* Album Cover */}
      <Image
        src={albumCover}
        alt={albumTitle}
        width={500}
        height={500}
        className="rounded-t-lg w-full h-48 object-cover"
        priority
      />

      {/* Album Details */}
      <div className="p-4">
        <h2 className="text-lg font-semibold">{albumTitle}</h2>
        <p className="text-gray-600">{artistName}</p>
        <p className="text-gray-500 text-sm">Released: {new Date(releaseDate).toLocaleDateString()}</p>
      </div>
    </div>
  );
}
