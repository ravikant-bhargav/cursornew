import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CountriesList.css';

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

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
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let filtered = countries;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(country => country.region === selectedRegion);
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.common.localeCompare(b.name.common);
        case 'population':
          return b.population - a.population;
        case 'area':
          return (b.area || 0) - (a.area || 0);
        default:
          return 0;
      }
    });

    setFilteredCountries(filtered);
  }, [searchTerm, selectedRegion, sortBy, countries]);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  const regions = ['all', ...new Set(countries.map(country => country.region))];

  return (
    <div className="countries-container">
      <div className="filters-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search countries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-controls">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="region-select"
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="population">Sort by Population</option>
            <option value="area">Sort by Area</option>
          </select>
        </div>
      </div>

      <p className="results-count">
        {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
      </p>
      
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
              {country.area && (
                <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showBackToTop && (
        <button
          className="back-to-top"
          onClick={handleBackToTop}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default CountriesList; 