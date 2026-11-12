function CountryCard({ country }) {
  const name = country.name?.common ?? country.names?.common ?? "Unknown country";
  const capital =
    country.capital?.[0] ??
    country.capitals?.[0]?.name ??
    "No capital available";
  const population = country.population ?? 0;
  const flagUrl = country.flags?.png ?? country.flag?.url_png ?? "";

  return (
    <div className="country-card">
      {flagUrl ? (
        <img src={flagUrl} alt={`Flag of ${name}`} className="country-flag" />
      ) : null}

      <div className="country-info">
        <h2>{name}</h2>

        <p>
          <strong>Capital:</strong> {capital}
        </p>

        <p>
          <strong>Population:</strong> {population.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default CountryCard;
