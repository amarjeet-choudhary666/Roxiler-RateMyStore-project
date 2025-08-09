import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';

const CreateStoreWidget: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-green-500 rounded-lg">
          <BuildingStorefrontIcon className="h-6 w-6 text-white" />
        </div>
        <h3 className="ml-3 text-lg font-semibold text-green-900">
          Store Management
        </h3>
      </div>
      
      <p className="text-green-800 mb-4 text-sm">
        Create and manage stores on the platform. Assign store owners and track performance.
      </p>
      
      <div className="space-y-3">
        <Link
          to="/admin/stores/create"
          className="flex items-center justify-between w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <span className="font-medium">Create New Store</span>
          <PlusIcon className="h-5 w-5" />
        </Link>
        
        <Link
          to="/admin/stores"
          className="flex items-center justify-between w-full p-3 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
        >
          <span className="font-medium">Manage All Stores</span>
          <BuildingStorefrontIcon className="h-5 w-5" />
        </Link>
      </div>
      
      <div className="mt-4 p-3 bg-green-200 rounded-lg">
        <p className="text-xs text-green-800">
          💡 <strong>Tip:</strong> When you create a store, the selected user will automatically be promoted to Store Owner role.
        </p>
      </div>
    </div>
  );
};

export default CreateStoreWidget;