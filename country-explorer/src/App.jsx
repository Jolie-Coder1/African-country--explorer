import { useState } from "react";
import useFetch from "./hooks/useFetch.jsx";
import useDebounce from "./hooks/useDebounce.jsx";
import CountryCard from "./components/CountryCard.jsx";
import "./App.css";

const API_URL = "https://api.restcountries.com/countries/v5/region/africa";

function App() {
  const { data = [], loading, error, refetch } = useFetch(API_URL);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name-asc");

  const debouncedSearch = useDebounce(search, 500);

  const filteredCountries = (data ?? []).filter((country) => {
    const countryName = country.name?.common ?? country.names?.common ?? "";
    return countryName.toLowerCase().includes(debouncedSearch.trim().toLowerCase());
  });

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    const countryA = a.name?.common ?? a.names?.common ?? "";
    const countryB = b.name?.common ?? b.names?.common ?? "";

    switch (sort) {
      case "name-desc":
        return countryB.localeCompare(countryA);

      case "population-high":
        return (b.population ?? 0) - (a.population ?? 0);

      case "population-low":
        return (a.population ?? 0) - (b.population ?? 0);

      default:
        return countryA.localeCompare(countryB);
    }
  });

  return (
    <div className="app">
      <header className="header">
        <h1>🌍 African Country Explorer</h1>
        <p>Discover countries across Africa</p>
      </header>

      <main className="container">
        <div className="controls">
          <input
            type="text"
            placeholder="Search for a country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="population-high">Population (Highest)</option>
            <option value="population-low">Population (Lowest)</option>
          </select>
        </div>

        {loading && <p className="message">Loading African countries...</p>}

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
            <button onClick={refetch}>Try Again</button>
          </div>
        )}

        {!loading && !error && sortedCountries.length === 0 && (
          <p className="message">No countries found. Try another search.</p>
        )}

        {!loading && !error && sortedCountries.length > 0 && (
          <>
            <p className="results-count">Showing {sortedCountries.length} countries</p>

            <div className="country-grid">
              {sortedCountries.map((country) => (
                <CountryCard key={country.cca3} country={country} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
