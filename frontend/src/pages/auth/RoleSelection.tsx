import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserIcon, 
  BuildingStorefrontIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const RoleSelection: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Choose Your Account Type
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            Select the type of account you want to create
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Normal User */}
          <Link
            to="/register"
            className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                <UserIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Normal User
              </h3>
              <p className="mt-4 text-gray-600">
                Browse stores, submit ratings, and discover new places in your area.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 group-hover:bg-blue-200 transition-colors">
                  Create User Account
                </span>
              </div>
            </div>
          </Link>

          {/* Store Owner */}
          <Link
            to="/register/store-owner"
            className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-green-300 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                <BuildingStorefrontIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                Store Owner
              </h3>
              <p className="mt-4 text-gray-600">
                Manage your store, view customer ratings, and grow your business.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-600 bg-green-100 group-hover:bg-green-200 transition-colors">
                  Create Store Account
                </span>
              </div>
            </div>
          </Link>

          {/* Admin */}
          <Link
            to="/register/admin"
            className="group relative bg-white p-8 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                <ShieldCheckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-900">
                System Admin
              </h3>
              <p className="mt-4 text-gray-600">
                Manage users, stores, and oversee the entire platform.
              </p>
              <div className="mt-6">
                <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-600 bg-purple-100 group-hover:bg-purple-200 transition-colors">
                  Create Admin Account
                </span>
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;