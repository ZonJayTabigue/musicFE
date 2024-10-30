import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { getAlbum } from '@/utils/api/albums/getAlbum';
import { Album } from '@/utils/constants/interfaces';
import AlbumPage from '@/app/album/[id]/page';
import { useParams, useRouter } from 'next/navigation';

// Mock the API call
jest.mock('../utils/api/albums/getAlbum');
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));

const mockAlbum: Album = {
  id: 1,
  album_cover_xl: 'https://example.com/cover_xl.jpg',
  album_title: 'Test Album Title',
  artist_name: 'Test Artist',
  release_date: '2024-01-01',
  tracks: [
    {
      title: 'Track 1',
      duration: '180',
      preview: 'https://example.com/track1.mp3',
    },
    {
      title: 'Track 2',
      duration: '240',
      preview: 'https://example.com/track2.mp3',
    },
  ],
  album_cover_image: '',
  album_cover_small: '',
  album_cover_medium: '',
  album_cover_big: ''
};

describe('AlbumPage Component', () => {
  beforeEach(() => {

    (useParams as jest.Mock).mockReturnValue({ id: '1' });

    (useRouter as jest.Mock).mockReturnValue({
      push: jest.fn(),
    });

    (getAlbum as jest.Mock).mockResolvedValue(mockAlbum);
  });

  test('displays loading state initially', () => {
    render(<AlbumPage />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('displays album details after loading', async () => {
    render(<AlbumPage />);

    await waitFor(() => {
      expect(screen.getByText(mockAlbum.album_title)).toBeInTheDocument();
      expect(screen.getByText(mockAlbum.artist_name)).toBeInTheDocument();
      expect(screen.getByText(/Release Date:/)).toHaveTextContent(
        `Release Date: ${new Date(mockAlbum.release_date).toLocaleDateString()}`
      );
    });
  });

  test('calculates and displays total duration of tracks', async () => {
    render(<AlbumPage />);

    await waitFor(() => {
      const totalMinutes = Math.floor(
        (Number(mockAlbum.tracks[0].duration) + Number(mockAlbum.tracks[1].duration)) / 60
      );
      const totalHours = Math.floor(totalMinutes / 60);
      const remainingMinutes = totalMinutes % 60;

      expect(screen.getByText(/Songs:/)).toHaveTextContent(
        `Songs: ${mockAlbum.tracks.length} • ${totalHours} hour${totalHours > 1 ? 's' : ''} and ${remainingMinutes} minutes`
      );
    });
  });

  test('renders the track list with correct details', async () => {
    render(<AlbumPage />);

    await waitFor(() => {
      mockAlbum.tracks.forEach((track) => {
        expect(screen.getByText(track.title)).toBeInTheDocument();
      });
    });
  });

});
