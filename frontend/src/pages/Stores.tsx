import React, { useState, useEffect } from 'react';
import { storeAPI, ratingAPI } from '../services/api';
import { MagnifyingGlassIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  totalRatings: number;
}

const Stores: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userRatings, setUserRatings] = useState<Record<string, number>>({});

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await storeAPI.getAllStores();
      console.log('Stores API response:', response.data);
      
      const storesData = response.data.data?.stores || response.data.stores || [];
      setStores(storesData);
    } catch (error: any) {
      console.error('Failed to fetch stores:', error);
      toast.error('Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await ratingAPI.getUserRatings();
      console.log('User ratings API response:', response.data);
      
      const ratingsData = response.data.data || response.data || [];
      const ratingsMap = ratingsData.reduce((acc: Record<string, number>, rating: any) => {
        acc[rating.store.id] = rating.rating;
        return acc;
      }, {});
      setUserRatings(ratingsMap);
    } catch (error: any) {
      console.error('Failed to fetch user ratings:', error);
      // Don't show error toast for ratings as it's not critical
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchStores();
      return;
    }

    setLoading(true);
    try {
      const response = await storeAPI.searchStores({ query: searchQuery });
      setStores(response.data.stores);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async (storeId: string, rating: number) => {
    try {
      console.log('Submitting rating:', { storeId, rating });
      const response = await ratingAPI.submitRating({ storeId, rating });
      console.log('Rating submit response:', response.data);
      
      setUserRatings(prev => ({ ...prev, [storeId]: rating }));
      toast.success('Rating submitted successfully!');
      fetchStores(); // Refresh to get updated averages
    } catch (error: any) {
      console.error('Failed to submit rating:', error);
      console.error('Error response:', error.response?.data);
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to submit rating';
      toast.error(message);
    }
  };

  const updateRating = async (storeId: string, rating: number) => {
    try {
      console.log('Updating rating:', { storeId, rating });
      
      // Find the rating ID
      const userRatingsResponse = await ratingAPI.getUserRatings();
      const ratingsData = userRatingsResponse.data.data || userRatingsResponse.data || [];
      const existingRating = ratingsData.find((r: any) => r.store.id === storeId);
      
      if (existingRating) {
        const response = await ratingAPI.updateRating(existingRating.id, rating);
        console.log('Rating update response:', response.data);
        
        setUserRatings(prev => ({ ...prev, [storeId]: rating }));
        toast.success('Rating updated successfully!');
        fetchStores(); // Refresh to get updated averages
      } else {
        console.error('Existing rating not found for store:', storeId);
        toast.error('Could not find existing rating to update');
      }
    } catch (error: any) {
      console.error('Failed to update rating:', error);
      console.error('Error response:', error.response?.data);
      
      const message = error.response?.data?.message || 
                     error.response?.data?.error || 
                     'Failed to update rating';
      toast.error(message);
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => interactive && onRate && onRate(star)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
          >
            <StarSolidIcon
              className={`h-5 w-5 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Browse Stores</h1>
        
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search stores by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div key={store.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{store.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{store.address}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {renderStars(store.averageRating)}
                  <span className="ml-2 text-sm text-gray-600">
                    ({store.averageRating.toFixed(1)})
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {store.totalRatings} reviews
                </span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Rating:</span>
                {userRatings[store.id] && (
                  <span className="text-xs text-blue-600">
                    {userRatings[store.id]}/5 stars
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                {renderStars(
                  userRatings[store.id] || 0,
                  true,
                  (rating) => {
                    if (userRatings[store.id]) {
                      updateRating(store.id, rating);
                    } else {
                      submitRating(store.id, rating);
                    }
                  }
                )}
                <span className="text-xs text-gray-500">
                  {userRatings[store.id] ? 'Click to update' : 'Click to rate'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stores.length === 0 && (
        <div className="text-center py-12">
          <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No stores found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 'Try a different search term.' : 'No stores available at the moment.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Stores;