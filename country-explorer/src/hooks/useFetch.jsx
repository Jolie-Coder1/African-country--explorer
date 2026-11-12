import { useCallback, useEffect, useState } from "react";

const fallbackCountries = [
  {
    name: { common: "Algeria" },
    capital: ["Algiers"],
    population: 45606480,
    flags: { png: "https://flagcdn.com/w320/dz.png" },
    cca3: "DZA",
  },
  {
    name: { common: "Egypt" },
    capital: ["Cairo"],
    population: 112716598,
    flags: { png: "https://flagcdn.com/w320/eg.png" },
    cca3: "EGY",
  },
  {
    name: { common: "Kenya" },
    capital: ["Nairobi"],
    population: 55100586,
    flags: { png: "https://flagcdn.com/w320/ke.png" },
    cca3: "KEN",
  },
  {
    name: { common: "Morocco" },
    capital: ["Rabat"],
    population: 37457971,
    flags: { png: "https://flagcdn.com/w320/ma.png" },
    cca3: "MAR",
  },
  {
    name: { common: "Nigeria" },
    capital: ["Abuja"],
    population: 223804632,
    flags: { png: "https://flagcdn.com/w320/ng.png" },
    cca3: "NGA",
  },
  {
    name: { common: "South Africa" },
    capital: ["Pretoria"],
    population: 60414495,
    flags: { png: "https://flagcdn.com/w320/za.png" },
    cca3: "ZAF",
  },
];

function normalizeCountries(responseData) {
  if (Array.isArray(responseData)) {
    return responseData;
  }

  if (Array.isArray(responseData?.data?.objects)) {
    return responseData.data.objects;
  }

  if (Array.isArray(responseData?.data)) {
    return responseData.data;
  }

  return [];
}

export default function useFetch(url) {
  const [data, setData] = useState(fallbackCountries);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: 
          `Bearer ${import.meta.env.VITE_COUNTRIES_API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();

      if (result?.data?._demo) {
        setData(fallbackCountries);
        return;
      }

      const countries = normalizeCountries(result);

      if (countries.length > 0) {
        setData(countries);
      } else {
        setData(fallbackCountries);
      }
    } catch (err) {
      setError(err.message || "Something went wrong while fetching countries.");
      setData(fallbackCountries);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
