import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RestaurantCard from './RestaurantCard';
import styles from './Body.module.css';
import Shimmer from './Shimmer';
import.meta.env.VITE_DEFAULT_LAT
import.meta.env.VITE_PROXY_BASE


const cuisineFilters = [
  { id: 'all', name: 'All', image: '/images/cuisines/all.png' },
  { id: 'indian', name: 'Indian', image: '/images/cuisines/indian.png' },
  { id: 'chinese', name: 'Chinese', image: '/images/cuisines/chinese.png' },
  { id: 'italian', name: 'Italian', image: '/images/cuisines/italian.png' },
  { id: 'american', name: 'American', image: '/images/cuisines/american.png' },
];

const Body = () => {
  const [listOfRestaurants, setListOfRestaurant] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: import.meta.env.VITE_DEFAULT_LAT || 18.5204,
    lng: import.meta.env.VITE_DEFAULT_LNG || 73.8567,
  });

  useEffect(() => {
    getUserLocation();
  }, []);

  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      fetchRestaurants();
    }
  }, [userLocation]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.log('⚠️ Location access denied. Using default coordinates.');
        }
      );
    }
  };

  const fetchRestaurants = async () => {
    setIsLoading(true);
    setError(null);

    const swiggyUrl = `${import.meta.env.VITE_SWIGGY_API_BASE}/restaurants/list/v5?lat=${userLocation.lat}&lng=${userLocation.lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_PROXY_BASE}?url=${encodeURIComponent(swiggyUrl)}`
      );

      if (!response.ok) throw new Error('Network response was not OK');

      const data = await response.json();

      const restaurants =
        data?.data?.cards?.find((card) =>
          card?.card?.card?.gridElements?.infoWithStyle?.restaurants
        )?.card?.card?.gridElements?.infoWithStyle?.restaurants || [];

      if (restaurants.length === 0) throw new Error('No restaurants found');

      setListOfRestaurant(restaurants);
      setFilteredRestaurants(restaurants);
    } catch (err) {
      console.error('API Error:', err.message);
      setError('⚠️ Failed to load restaurants from Swiggy. Please check proxy or try again later.');
    }

    setIsLoading(false);
  };

  const handleSearch = () => {
    if (!searchText.trim()) return;

    setIsSearching(true);

    setTimeout(() => {
      const searchTerm = searchText.toLowerCase();
      const filtered = listOfRestaurants.filter((res) => {
        const name = res?.info?.name?.toLowerCase() || '';
        const cuisines = res?.info?.cuisines?.join(' ').toLowerCase() || '';
        const area = res?.info?.areaName?.toLowerCase() || '';
        return (
          name.includes(searchTerm) ||
          cuisines.includes(searchTerm) ||
          area.includes(searchTerm)
        );
      });
      setFilteredRestaurants(filtered);
      setActiveFilter('all');
      setIsSearching(false);
    }, 400);
  };

  const handleFilterClick = (filterType) => {
    setActiveFilter(filterType);
    if (filterType === 'all') {
      setFilteredRestaurants(listOfRestaurants);
    } else {
      const filtered = listOfRestaurants.filter((res) =>
        res?.info?.cuisines?.some((cuisine) =>
          cuisine.toLowerCase().includes(filterType)
        )
      );
      setFilteredRestaurants(filtered);
    }
  };

  const handleSort = (sortType) => {
    setSortBy(sortType);
    const sorted = [...filteredRestaurants];
    switch (sortType) {
      case 'rating':
        sorted.sort((a, b) => b.info.avgRating - a.info.avgRating);
        break;
      case 'deliveryTime':
        sorted.sort((a, b) => a.info.sla.deliveryTime - b.info.sla.deliveryTime);
        break;
      case 'costLowToHigh':
        sorted.sort(
          (a, b) =>
            parseInt(a.info.costForTwo.match(/\d+/)[0]) -
            parseInt(b.info.costForTwo.match(/\d+/)[0])
        );
        break;
      case 'costHighToLow':
        sorted.sort(
          (a, b) =>
            parseInt(b.info.costForTwo.match(/\d+/)[0]) -
            parseInt(a.info.costForTwo.match(/\d+/)[0])
        );
        break;
      default:
        break;
    }
    setFilteredRestaurants(sorted);
  };

  if (isLoading) return <Shimmer type="full" />;

  return (
    <div className={styles.body}>
      {/* Error Banner */}
      {error && (
        <div className={styles.errorNotification}>
          <p>{error}</p>
          <button className={styles.retryBtn} onClick={fetchRestaurants}>
            🔄 Retry
          </button>
        </div>
      )}

      {/* Banner Section */}
      <header className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Craving Something Delicious?</h1>
          <p>Find the best restaurants near you</p>
          <div className={styles.searchContainer}>
            <input
              className={styles.searchBox}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by name, cuisine or area..."
              disabled={isSearching}
            />
            <button
              className={styles.searchBtn}
              onClick={handleSearch}
              disabled={isSearching}
            >
              {isSearching ? '⏳' : '🔍'}
            </button>
          </div>
        </div>
      </header>

      {/* Cuisine Filters */}
      <div className={styles.cuisineCircles}>
        {cuisineFilters.map((cuisine) => (
          <div
            key={cuisine.id}
            className={`${styles.cuisineCircle} ${
              activeFilter === cuisine.id ? styles.active : ''
            }`}
            onClick={() => handleFilterClick(cuisine.id)}
          >
            <img src={cuisine.image} alt={cuisine.name} />
            <span>{cuisine.name}</span>
          </div>
        ))}
      </div>

      {/* Sorting Filters */}
      <div className={styles.filterSection}>
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters ▲' : 'Show Filters ▼'}
        </button>
        {showFilters && (
          <div className={styles.filterControls}>
            <h4>Sort By:</h4>
            {['relevance', 'rating', 'deliveryTime', 'costLowToHigh', 'costHighToLow'].map(
              (sort) => (
                <button
                  key={sort}
                  className={`${styles.filterBtn} ${
                    sortBy === sort ? styles.active : ''
                  }`}
                  onClick={() => handleSort(sort)}
                >
                  {sort === 'costLowToHigh'
                    ? 'Cost: Low to High'
                    : sort === 'costHighToLow'
                    ? 'Cost: High to Low'
                    : sort.charAt(0).toUpperCase() + sort.slice(1)}
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Searching Spinner */}
      {isSearching && <Shimmer type="spinner" />}

      {/* Restaurant Cards */}
      {!isSearching && (
        <div className={styles.resContainer}>
          {filteredRestaurants.length === 0 ? (
            <div className={styles.noResults}>
              <h3>😔 No restaurants found</h3>
              <button
                className={styles.resetBtn}
                onClick={() => {
                  setFilteredRestaurants(listOfRestaurants);
                  setSearchText('');
                  setActiveFilter('all');
                }}
              >
                🔄 Reset
              </button>
            </div>
          ) : (
            filteredRestaurants.map((res) => (
              <Link
                key={res.info.id}
                to={`/restaurant/${res.info.id}`}
                className={styles.cardLink}
              >
                <RestaurantCard resData={res} />
              </Link>
            ))
          )}
        </div>
      )}

      {/* Footer */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} MealTrails · Made with 🍕 by Rushikesh Kamble</p>
      </footer>
    </div>
  );
};

export default Body;
