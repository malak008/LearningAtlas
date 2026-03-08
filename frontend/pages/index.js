import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/search-ai?q=${encodeURIComponent(query)}`);

      if (!res.ok) {
        throw new Error("API request failed");
      }

      const data = await res.json();

      if (Array.isArray(data)) {
        setResults(data);
      } else {
        setResults([]);
      }

    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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
          <p className="text-center text-[#001F54] mb-4">
            Searching resources...
          </p>
        )}

        {/* Results */}
        <ul className="max-w-3xl mx-auto space-y-4">

          {!loading && results.length === 0 && query && (
            <li className="text-center text-[#001F54]">
              No results found.
            </li>
          )}

          {results.map((r, idx) => (
            <li
              key={idx}
              className="bg-[#FDF6E3] p-4 rounded-lg shadow hover:shadow-md transition"
            >
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
            </li>
          ))}

        </ul>

      </div>

    </div>
  );
}