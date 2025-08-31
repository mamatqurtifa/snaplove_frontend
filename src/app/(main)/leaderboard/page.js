'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/services/api';
import RoleBadge from '@/components/ui/RoleBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter states
  const [period, setPeriod] = useState('7d');
  const [rankingType, setRankingType] = useState('combined');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(50);

  // Fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await api.get('/leaderboard/public', {
        params: {
          period,
          type: rankingType,
          page: currentPage,
          limit
        }
      });

      if (response.data.success) {
        setLeaderboardData(response.data.data);
        setError(null);
      } else {
        setError('Failed to load leaderboard data');
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [period, rankingType, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [period, rankingType]);

  const handleUserClick = (username) => {
    router.push(`/user/${username}`);
  };

  const getRankIcon = (rank) => {
    if (rank === 1) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
      );
    }
    if (rank === 2) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">2</span>
        </div>
      );
    }
    if (rank === 3) {
      return (
        <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-sm">3</span>
        </div>
      );
    }
    return (
      <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
        <span className="text-white font-medium text-sm">{rank}</span>
      </div>
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Leaderboard</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLeaderboard}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🏆 Leaderboard
        </h1>
        <p className="text-gray-600 text-lg">
          Top creators ranked by their frame performance
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Period Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="1m">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Ranking Type Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ranking:</label>
            <select
              value={rankingType}
              onChange={(e) => setRankingType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="combined">Combined Score</option>
              <option value="likes">Most Liked</option>
              <option value="uses">Most Used</option>
            </select>
          </div>

          {/* Stats Summary */}
          {leaderboardData?.statistics && (
            <div className="text-sm text-gray-600 text-center md:text-right">
              <div>{formatNumber(leaderboardData.statistics.period_stats.total_frames)} frames</div>
              <div>{formatNumber(leaderboardData.statistics.period_stats.unique_creators)} creators</div>
            </div>
          )}
        </div>

        {/* Period Description */}
        {leaderboardData?.period && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              📊 {leaderboardData.period.description}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {leaderboardData.period.scoring_info}
            </p>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {leaderboardData?.leaderboard?.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {leaderboardData.leaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                  entry.rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                }`}
                onClick={() => handleUserClick(entry.user.username)}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(entry.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={entry.user.image_profile || '/images/default-avatar.png'}
                        alt={entry.user.name}
                        className="rounded-full object-cover"
                        fill
                        sizes="48px"
                      />
                    </div>

                    {/* Name and Username */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 truncate">
                          {entry.user.name}
                        </h3>
                        <RoleBadge role={entry.user.role} />
                      </div>
                      <p className="text-gray-600 text-sm">@{entry.user.username}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg text-blue-600">
                        {formatNumber(entry.stats.score)}
                      </div>
                      <div className="text-gray-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-pink-600">
                        {formatNumber(entry.stats.total_likes)}
                      </div>
                      <div className="text-gray-500">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-green-600">
                        {formatNumber(entry.stats.total_uses)}
                      </div>
                      <div className="text-gray-500">Uses</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-purple-600">
                        {entry.stats.frame_count}
                      </div>
                      <div className="text-gray-500">Frames</div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden flex flex-col items-end text-sm">
                    <div className="font-bold text-blue-600 text-lg">
                      {formatNumber(entry.stats.score)}
                    </div>
                    <div className="text-gray-500 text-xs">Score</div>
                  </div>

                  {/* Top Frames Preview */}
                  {entry.top_frames && entry.top_frames.length > 0 && (
                    <div className="hidden lg:flex items-center gap-2">
                      {entry.top_frames.slice(0, 3).map((frame) => (
                        <div
                          key={frame.id}
                          className="relative w-12 h-12 rounded-lg overflow-hidden shadow-sm"
                          title={frame.title}
                        >
                          <Image
                            src={frame.thumbnail}
                            alt={frame.title}
                            className="object-cover"
                            fill
                            sizes="48px"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile expanded stats */}
                <div className="md:hidden mt-4 grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-bold text-pink-600">{formatNumber(entry.stats.total_likes)}</div>
                    <div className="text-gray-500 text-xs">Likes</div>
                  </div>
                  <div>
                    <div className="font-bold text-green-600">{formatNumber(entry.stats.total_uses)}</div>
                    <div className="text-gray-500 text-xs">Uses</div>
                  </div>
                  <div>
                    <div className="font-bold text-purple-600">{entry.stats.frame_count}</div>
                    <div className="text-gray-500 text-xs">Frames</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Data Available</h3>
            <p className="text-gray-600">No creators found for the selected period and criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {leaderboardData?.pagination && leaderboardData.pagination.total_pages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!leaderboardData.pagination.has_prev_page}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, leaderboardData.pagination.total_pages) }, (_, i) => {
              const pageNum = i + 1;
              const isActive = pageNum === currentPage;
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            {leaderboardData.pagination.total_pages > 5 && (
              <>
                <span className="text-gray-400">...</span>
                <button
                  onClick={() => setCurrentPage(leaderboardData.pagination.total_pages)}
                  className="w-10 h-10 rounded-lg font-medium bg-white border border-gray-300 hover:bg-gray-50"
                >
                  {leaderboardData.pagination.total_pages}
                </button>
              </>
            )}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!leaderboardData.pagination.has_next_page}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Statistics Summary */}
      {leaderboardData?.statistics && (
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
            📈 Period Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {formatNumber(leaderboardData.statistics.period_stats.total_frames)}
              </div>
              <div className="text-gray-600 text-sm">Total Frames</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-pink-600">
                {formatNumber(leaderboardData.statistics.period_stats.total_likes)}
              </div>
              <div className="text-gray-600 text-sm">Total Likes</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {formatNumber(leaderboardData.statistics.period_stats.total_uses)}
              </div>
              <div className="text-gray-600 text-sm">Total Uses</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {formatNumber(leaderboardData.statistics.period_stats.unique_creators)}
              </div>
              <div className="text-gray-600 text-sm">Creators</div>
            </div>
          </div>
        </div>
      )}

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <details className="bg-gray-100 p-4 rounded-lg">
            <summary className="font-bold cursor-pointer">Debug Info</summary>
            <div className="mt-2 text-sm">
              <p><strong>Period:</strong> {period}</p>
              <p><strong>Ranking Type:</strong> {rankingType}</p>
              <p><strong>Current Page:</strong> {currentPage}</p>
              <p><strong>Total Items:</strong> {leaderboardData?.pagination?.total_items || 0}</p>
              <pre className="bg-gray-200 p-2 mt-2 rounded text-xs overflow-auto max-h-40">
                {JSON.stringify(leaderboardData, null, 2)}
              </pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}