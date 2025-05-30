import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CountriesList.css';

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = response.data.sort((a, b) => 
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        setFilteredCountries(sortedCountries);
        setLoading(false);
      } catch (err) {
        setError('Error fetching countries: ' + err.message);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCountries(filtered);
  }, [searchTerm, countries]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading countries...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="countries-container">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <p className="results-count">
          {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
        </p>
      </div>
      
      <div className="countries-grid">
        {filteredCountries.map((country) => (
          <div key={country.cca3} className="country-card">
            <img
              src={country.flags.png}
              alt={`${country.name.common} flag`}
              className="country-flag"
            />
            <div className="country-info">
              <h3>{country.name.common}</h3>
              <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
              <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Region:</strong> {country.region}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountriesList; 