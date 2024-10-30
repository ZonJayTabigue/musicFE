import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlbumCard from '@/components/albumCard';

describe('AlbumCard Component', () => {
  const mockProps = {
    albumCover: 'https://example.com/cover.jpg',
    albumTitle: 'Test Album Title',
    artistName: 'Test Artist',
    releaseDate: '2024-01-01',
  };

  test('renders the album title', () => {
    render(<AlbumCard {...mockProps} />);
    const albumTitle = screen.getByText(mockProps.albumTitle);
    expect(albumTitle).toBeInTheDocument();
  });

  test('renders the artist name', () => {
    render(<AlbumCard {...mockProps} />);
    const artistName = screen.getByText(mockProps.artistName);
    expect(artistName).toBeInTheDocument();
  });

  test('renders the release date correctly formatted', () => {
    render(<AlbumCard {...mockProps} />);
    const releaseDate = screen.getByText(/Released:/i);
    expect(releaseDate).toBeInTheDocument();
    expect(releaseDate).toHaveTextContent('Released: 1/1/2024');
  });

  test('renders the title in small font size if longer than 30 characters', () => {
    const longTitleProps = {
      ...mockProps,
      albumTitle: 'This is a very long album title that exceeds thirty characters',
    };
    render(<AlbumCard {...longTitleProps} />);
    const albumTitle = screen.getByText(longTitleProps.albumTitle);
    expect(albumTitle).toHaveClass('text-sm');
  });

  test('renders the title in large font size if 30 characters or less', () => {
    render(<AlbumCard {...mockProps} />);
    const albumTitle = screen.getByText(mockProps.albumTitle);
    expect(albumTitle).toHaveClass('text-lg');
  });
});
