import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { 
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FunnelIcon,
  ShieldCheckIcon,
  UserIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const LightCard = ({ children, className = "" }) => (
  <motion.div
    className={`bg-white/90 backdrop-blur-lg border border-gray-200/60 rounded-2xl p-6 
                shadow-lg shadow-gray-200/25 hover:shadow-xl hover:shadow-gray-200/35 
                transition-all duration-300 ${className}`}
    whileHover={{ y: -3, scale: 1.005 }}
  >
    {children}
  </motion.div>
);

const RoleBadge = ({ role }) => {
  const displayRole = role === 'USER' ? 'STUDENT' : role;
  const roleStyles = {
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    STUDENT: 'bg-blue-100 text-blue-700 border-blue-200'
  };

  const RoleIcon = role === 'ADMIN' ? ShieldCheckIcon : UserIcon;
  const styleKey = role === 'USER' ? 'STUDENT' : role;

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center space-x-1 ${roleStyles[styleKey]}`}>
      <RoleIcon className="w-3 h-3" />
      <span>{displayRole}</span>
    </span>
  );
};

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || 
      user.role === roleFilter || 
      (roleFilter === 'STUDENT' && user.role === 'USER');
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, itemsPerPage]);

  const stats = {
    totalUsers: users.length,
    adminUsers: users.filter(u => u.role === 'ADMIN').length,
    studentUsers: users.filter(u => u.role === 'STUDENT' || u.role === 'USER').length
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Geometric Background Pattern */}
      <div className="fixed inset-0 bg-geometric-pattern opacity-40" style={{ backgroundSize: '20px 20px' }} />
      <div className="fixed inset-0 bg-wave-pattern opacity-20" />

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
            User <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">Management</span>
          </h1>
          <p className="text-gray-500 font-normal text-lg">Manage student and admin accounts</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <LightCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-gray-600 font-medium">Total Users</div>
              </div>
              <div className="w-12 h-12 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </LightCard>
          
          <LightCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stats.adminUsers}</div>
                <div className="text-sm text-gray-600 font-medium">Administrators</div>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="w-6 h-6" />
              </div>
            </div>
          </LightCard>
          
          <LightCard>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stats.studentUsers}</div>
                <div className="text-sm text-gray-600 font-medium">Students</div>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <UserIcon className="w-6 h-6" />
              </div>
            </div>
          </LightCard>
        </div>

        {/* Search and Filters */}
        <LightCard className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="md:col-span-2 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 
                           text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FunnelIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              >
                <option value="ALL">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="STUDENT">Student</option>
              </select>
            </div>

            {/* Items Per Page */}
            <div>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-xl 
                           focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-gray-800"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>
        </LightCard>

        {/* Users Table */}
        <LightCard>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading users...</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Username</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Role</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, i) => (
                    <motion.tr
                      key={user.id}
                      className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{user.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600 font-mono text-sm">{user.username}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-gray-600">{user.email}</div>
                      </td>
                      <td className="py-4 px-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <TrashIcon className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No users found matching your search criteria.
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="w-4 h-4" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? 'bg-teal-600 text-white'
                            : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-2 text-gray-400">...</span>;
                  }
                  return null;
                })}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </LightCard>
      </div>
    </div>
  );
};

export default UserManagementPage;