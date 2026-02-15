interface Bookmark {
  id: string;
  title: string;
  url: string;
}

interface Props {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
}

export default function BookmarkList({ bookmarks, onDelete }: Props) {
  if (bookmarks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10 border rounded bg-white">
        No bookmarks yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex justify-between items-center p-4 border rounded bg-white"
        >
          <div>
            <p className="font-semibold">{bookmark.title}</p>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm break-all"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => onDelete(bookmark.id)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
