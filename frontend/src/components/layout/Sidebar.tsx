import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  BuildingStorefrontIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  PresentationChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const navigation: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: HomeIcon,
    roles: ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'],
  },
  {
    name: 'Browse Stores',
    href: '/stores',
    icon: BuildingStorefrontIcon,
    roles: ['NORMAL_USER'],
  },
  {
    name: 'My Ratings',
    href: '/my-ratings',
    icon: StarIcon,
    roles: ['NORMAL_USER'],
  },
  {
    name: 'Admin Dashboard',
    href: '/admin/dashboard',
    icon: ChartBarIcon,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    name: 'Manage Users',
    href: '/admin/users',
    icon: UserGroupIcon,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    name: 'Manage Stores',
    href: '/admin/stores',
    icon: BuildingStorefrontIcon,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    name: 'Create Store',
    href: '/admin/stores/create',
    icon: PlusIcon,
    roles: ['SYSTEM_ADMIN'],
  },
  {
    name: 'Store Dashboard',
    href: '/store-owner/dashboard',
    icon: PresentationChartBarIcon,
    roles: ['STORE_OWNER'],
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: Cog6ToothIcon,
    roles: ['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'],
  },
];

const Sidebar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const filteredNavigation = navigation.filter(item =>
    item.roles.includes(user.role)
  );

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {filteredNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                  />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;