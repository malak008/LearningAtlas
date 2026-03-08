import { useState } from "react";

function BookmarkIconOutline({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
    </svg>
  );
}

function BookmarkIconSolid({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
    </svg>
  );
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search-ai?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("API request failed");
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleBookmark = (resource) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.link === resource.link);
      if (exists) return prev.filter((b) => b.link !== resource.link);
      return [...prev, resource];
    });
  };

  const isBookmarked = (link) => bookmarks.some((b) => b.link === link);

  return (
    <div className="relative overflow-hidden min-h-screen bg-[#F5F0E1] p-6 md:p-12 font-sans">

      {/* Background Animation */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <img src="/bgelements/1.png" alt="" className="falling-item item-1" />
        <img src="/bgelements/2.png" alt="" className="falling-item item-2" />
        <img src="/bgelements/3.png" alt="" className="falling-item item-3" />
        <img src="/bgelements/4.png" alt="" className="falling-item item-5" />
        <img src="/bgelements/5.png" alt="" className="falling-item item-6" />
        <img src="/bgelements/6.png" alt="" className="falling-item item-7" />
        <img src="/bgelements/7.png" alt="" className="falling-item item-8" />
      </div>

      {/* ── Bookmark Menu (top-left) ── */}
      <div className="fixed top-5 left-5 z-50">
        {/* Trigger button */}
        <button onClick={() => setMenuOpen((prev) => !prev)} className="flex items-center gap-2 bg-[#FDF6E3] border border-[#001F54] text-[#001F54] px-3 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:bg-[#EFE8D5]">
          <BookmarkIconSolid className="w-4 h-4 text-[#4B0000]" />
          <span className="text-xs font-semibold tracking-wide">
            Bookmarks
            {bookmarks.length > 0 && (
              <span className="ml-1 bg-[#4B0000] text-[#FDF6E3] rounded-full px-1.5 py-0.5 text-[10px]">
                {bookmarks.length}
              </span>
            )}
          </span>
        </button>

        {/* Dropdown panel */}
        <div
          className={`absolute top-full left-0 mt-2 w-72 bg-[#FDF6E3] border border-[#001F54] rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
            menuOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
          }`}
          style={{ transition: "opacity 0.2s ease, transform 0.2s ease" }}
        >
          {bookmarks.length === 0 ? (
            <p className="text-center text-[#001F54] text-sm py-5 px-4 opacity-60">
              No bookmarks yet 🔖
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto divide-y divide-[#E8DFC8]">
              {bookmarks.map((b, idx) => (
                <li key={idx} className="flex items-start gap-2 px-4 py-3 hover:bg-[#EFE8D5] transition-colors">
                  <BookmarkIconSolid className="w-3.5 h-3.5 mt-0.5 text-[#4B0000] flex-shrink-0" />
                  <div className="min-w-0">
                    <a
                      href={b.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4B0000] text-sm font-semibold hover:underline block truncate"
                    >
                      {b.title}
                    </a>
                    <p className="text-[#001F54] text-xs opacity-60 mt-0.5">
                      {b.type} · {b.level}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleBookmark(b)}
                    className="ml-auto text-[#001F54] opacity-40 hover:opacity-80 text-xs flex-shrink-0"
                    title="Remove"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10">

        {/* Page Title */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[#001F54]">
          Learning Atlas 🔍🗺
        </h1>

        {/* Search Bar */}
        <div className="flex justify-center mb-8 flex-col md:flex-row items-center gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type something to learn..."
            className="p-3 w-full md:w-96 rounded-md border border-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#4B0000]"
          />
          <button
            onClick={handleSearch}
            className="bg-[#4B0000] text-[#FDF6E3] px-6 py-3 rounded-md hover:bg-[#6B0A0A] transition w-full md:w-auto"
          >
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-[#001F54] mb-4">Searching resources...</p>
        )}

        {/* Results */}
        <ul className="max-w-3xl mx-auto space-y-4">
          {!loading && results.length === 0 && query && (
            <li className="text-center text-[#001F54]">No results found.</li>
          )}

          {results.map((r, idx) => (
            <li
              key={idx}
              className="bg-[#FDF6E3] p-4 rounded-lg shadow hover:shadow-md transition flex items-start justify-between gap-3"
            >
              {/* Resource info */}
              <div className="min-w-0">
                <a
                  href={r.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#4B0000] font-semibold hover:underline"
                >
                  {r.title}
                </a>
                <p className="text-[#001F54] text-sm mt-1">
                  [{r.type}] - Level: {r.level} - Tags: {r.tags}
                </p>
              </div>

              {/* Bookmark button */}
              <button
                onClick={() => toggleBookmark(r)}
                title={isBookmarked(r.link) ? "Remove bookmark" : "Bookmark this"}
                className="flex-shrink-0 mt-0.5 transition-transform duration-150 hover:scale-125 active:scale-95"
              >
                {isBookmarked(r.link) ? (
                  <BookmarkIconSolid className="w-5 h-5 text-[#4B0000]" />
                ) : (
                  <BookmarkIconOutline className="w-5 h-5 text-[#001F54] opacity-40 hover:opacity-80" />
                )}
              </button>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}