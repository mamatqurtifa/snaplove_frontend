'use client';
import { useState, useEffect } from 'react';
import { FaServer, FaMemory, FaDatabase, FaNetworkWired, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ServerHealthPage() {
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/serverHealth`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data.data);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Error fetching server health:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
    
    // Set up interval for auto-refresh
    const intervalId = setInterval(() => {
      fetchHealthData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  const handleRefreshIntervalChange = (e) => {
    setRefreshInterval(Number(e.target.value));
  };

  const handleManualRefresh = () => {
    fetchHealthData();
  };

  const getStatusColor = (status) => {
    if (status === 'healthy' || status === 'connected' || status === 'online') {
      return 'text-green-500';
    } else if (status === 'warning') {
      return 'text-yellow-500';
    } else {
      return 'text-red-500';
    }
  };

  const formatUptime = (seconds) => {
    if (!seconds && seconds !== 0) return 'N/A';
    
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    if (!bytes) return 'N/A';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const HealthStatusIcon = ({ status }) => {
    if (!status) return null;
    
    if (status === 'healthy' || status === 'connected' || status === 'online') {
      return <FaCheckCircle className="text-green-500" />;
    } else {
      return <FaExclamationTriangle className="text-red-500" />;
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Server Health Monitoring</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="refreshInterval" className="mr-2 text-sm text-gray-600">
              Refresh every:
            </label>
            <select
              id="refreshInterval"
              value={refreshInterval}
              onChange={handleRefreshIntervalChange}
              className="p-2 border rounded-md"
            >
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
              <option value={300}>5 minutes</option>
            </select>
          </div>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Now'}
          </button>
        </div>
      </div>

      {lastRefreshed && (
        <div className="mb-4 text-sm text-gray-500">
          Last updated: {lastRefreshed.toLocaleString()}
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {loading && !healthData ? (
        <div className="flex justify-center p-12">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : healthData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* System Overview */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <div className="flex items-center mb-4">
              <FaServer className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">System Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Status</div>
                <div className="flex items-center mt-1">
                  <HealthStatusIcon status={healthData.health?.overall} />
                  <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.overall)}`}>
                    {healthData.health?.overall || 'Unknown'}
                  </span>
                </div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Uptime</div>
                <div className="font-semibold mt-1">{healthData.system?.uptime || 'Unknown'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Environment</div>
                <div className="font-semibold mt-1">{healthData.application?.environment || 'Unknown'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Version</div>
                <div className="font-semibold mt-1">{healthData.application?.version || 'Unknown'}</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Hostname</div>
                <div className="font-semibold mt-1">{healthData.system?.hostname || 'Unknown'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Platform</div>
                <div className="font-semibold mt-1">{healthData.system?.platform || 'Unknown'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Architecture</div>
                <div className="font-semibold mt-1">{healthData.system?.architecture || 'Unknown'}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">Node Version</div>
                <div className="font-semibold mt-1">{healthData.system?.nodeVersion || 'Unknown'}</div>
              </div>
            </div>
          </div>

          {/* CPU Usage */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FaServer className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">CPU</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Usage</span>
                  <span className="text-sm font-medium">{healthData.performance?.cpuLoad || 0}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      parseFloat(healthData.performance?.cpuLoad || 0) > 80 ? 'bg-red-500' : 
                      parseFloat(healthData.performance?.cpuLoad || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${parseFloat(healthData.performance?.cpuLoad || 0)}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Cores</div>
                <div className="font-semibold">{healthData.system?.cpus || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Load Average</div>
                <div className="font-semibold">
                  {healthData.system?.loadAverage ? healthData.system.loadAverage.join(' / ') : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FaNetworkWired className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Performance</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Response Time</div>
                <div className="font-semibold">{healthData.performance?.responseTime || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Query Time</div>
                <div className="font-semibold">{healthData.performance?.queryTime || 'N/A'}</div>
              </div>
              
              {/* Health Checks */}
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Health Checks</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">Database</div>
                    <div className="flex items-center">
                      <HealthStatusIcon status={healthData.health?.checks?.database} />
                      <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.database)}`}>
                        {healthData.health?.checks?.database || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Memory</div>
                    <div className="flex items-center">
                      <HealthStatusIcon status={healthData.health?.checks?.memory} />
                      <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.memory)}`}>
                        {healthData.health?.checks?.memory || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Disk</div>
                    <div className="flex items-center">
                      <HealthStatusIcon status={healthData.health?.checks?.disk} />
                      <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.disk)}`}>
                        {healthData.health?.checks?.disk || 'Unknown'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Response</div>
                    <div className="flex items-center">
                      <HealthStatusIcon status={healthData.health?.checks?.response} />
                      <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.response)}`}>
                        {healthData.health?.checks?.response || 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FaMemory className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Memory</h2>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500">Memory Pressure</span>
                  <span className="text-sm font-medium">{healthData.performance?.memoryPressure || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${
                      parseFloat(healthData.performance?.memoryPressure || 0) > 80 ? 'bg-red-500' : 
                      parseFloat(healthData.performance?.memoryPressure || 0) > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`} 
                    style={{ width: `${parseFloat(healthData.performance?.memoryPressure || 0)}%` }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-500">Total</div>
                  <div className="font-semibold">{healthData.system?.totalMemory || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Used</div>
                  <div className="font-semibold">{healthData.system?.usedMemory || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Free</div>
                  <div className="font-semibold">{healthData.system?.freeMemory || 'N/A'}</div>
                </div>
              </div>
              
              <div className="mt-3">
                <h3 className="text-sm font-semibold mb-2">Process Memory</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-sm text-gray-500">RSS</div>
                    <div className="font-semibold">{healthData.system?.memoryUsage?.rss || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Heap Total</div>
                    <div className="font-semibold">{healthData.system?.memoryUsage?.heapTotal || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Heap Used</div>
                    <div className="font-semibold">{healthData.system?.memoryUsage?.heapUsed || 'N/A'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">External</div>
                    <div className="font-semibold">{healthData.system?.memoryUsage?.external || 'N/A'}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Health Status</div>
                <div className="flex items-center mt-1">
                  <HealthStatusIcon status={healthData.health?.checks?.memory} />
                  <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.memory)}`}>
                    {healthData.health?.checks?.memory || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Database Status */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-4">
              <FaDatabase className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Database</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <HealthStatusIcon status={healthData.health?.checks?.database} />
                <span className={`ml-2 font-semibold ${getStatusColor(healthData.health?.checks?.database)}`}>
                  {healthData.health?.checks?.database || 'Unknown'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-500">Connection State</div>
                  <div className="font-semibold">{healthData.database?.currentState || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Host</div>
                  <div className="font-semibold text-xs truncate">{healthData.database?.host || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Port</div>
                  <div className="font-semibold">{healthData.database?.port || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Database Name</div>
                  <div className="font-semibold">{healthData.database?.databaseName || 'N/A'}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-sm text-gray-500">Collections</div>
                  <div className="font-semibold">{healthData.database?.collections || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Documents</div>
                  <div className="font-semibold">{healthData.database?.documents || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Data Size</div>
                  <div className="font-semibold">{healthData.database?.dataSize || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Storage Size</div>
                  <div className="font-semibold">{healthData.database?.storageSize || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Index Size</div>
                  <div className="font-semibold">{healthData.database?.indexSize || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Size</div>
                  <div className="font-semibold">{healthData.database?.totalSize || 'N/A'}</div>
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-500">Response Time</div>
                <div className="font-semibold">{healthData.performance?.queryTime || 'N/A'}</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <div className="flex items-center mb-4">
              <FaNetworkWired className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Recent Activity (24h)</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">New Users</div>
                <div className="font-semibold mt-1">{healthData.recentActivity?.last24Hours?.newUsers || 0}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">New Frames</div>
                <div className="font-semibold mt-1">{healthData.recentActivity?.last24Hours?.newFrames || 0}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">New Photos</div>
                <div className="font-semibold mt-1">{healthData.recentActivity?.last24Hours?.newPhotos || 0}</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-gray-500">New Tickets</div>
                <div className="font-semibold mt-1">{healthData.recentActivity?.last24Hours?.newTickets || 0}</div>
              </div>
            </div>
          </div>

          {/* Collections Data */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <div className="flex items-center mb-4">
              <FaDatabase className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Collections Data</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Users Collection */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Users</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-sm font-medium">{healthData.collections?.users?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active</span>
                    <span className="text-sm font-medium">{healthData.collections?.users?.active || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Banned</span>
                    <span className="text-sm font-medium">{healthData.collections?.users?.banned || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Photos Collection */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Photos</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-sm font-medium">{healthData.collections?.photos?.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Likes</span>
                    <span className="text-sm font-medium">{healthData.collections?.photos?.totalLikes || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* File System */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">File System</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Frames</span>
                    <span className="text-sm font-medium">{healthData.fileSystem?.uploads?.frames || '0 Bytes'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Photos</span>
                    <span className="text-sm font-medium">{healthData.fileSystem?.uploads?.photos || '0 Bytes'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Profiles</span>
                    <span className="text-sm font-medium">{healthData.fileSystem?.uploads?.profiles || '0 Bytes'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-sm font-medium">{healthData.fileSystem?.uploads?.total || '0 Bytes'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Application Information */}
          <div className="bg-white p-6 rounded-lg shadow-md col-span-1 lg:col-span-3">
            <div className="flex items-center mb-4">
              <FaServer className="text-blue-600 text-xl mr-2" />
              <h2 className="text-xl font-semibold">Application Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Basic Info</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Name</span>
                    <span className="text-sm font-medium">{healthData.application?.name || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Version</span>
                    <span className="text-sm font-medium">{healthData.application?.version || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Environment</span>
                    <span className="text-sm font-medium">{healthData.application?.environment || 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Port</span>
                    <span className="text-sm font-medium">{healthData.application?.port || 'Unknown'}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Security</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">CORS Enabled</span>
                    <span className="text-sm font-medium">{healthData.security?.cors?.enabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Helmet Enabled</span>
                    <span className="text-sm font-medium">{healthData.security?.helmet?.enabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rate Limit (General)</span>
                    <span className="text-sm font-medium">{healthData.security?.rateLimit?.general?.max || 'Unknown'} per {(healthData.security?.rateLimit?.general?.windowMs / 60000) || 'Unknown'} min</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold mb-2">Dependencies</h3>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Production</span>
                    <span className="text-sm font-medium">{healthData.dependencies?.production || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Development</span>
                    <span className="text-sm font-medium">{healthData.dependencies?.development || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Scripts</span>
                    <span className="text-sm font-medium">{healthData.dependencies?.scripts || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Main Entry</span>
                    <span className="text-sm font-medium truncate">{healthData.dependencies?.main || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold mb-2">Request Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Generated At</span>
                    <span className="text-sm font-medium">{new Date(healthData.generatedAt).toLocaleString() || 'Unknown'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">User</span>
                    <span className="text-sm font-medium">{healthData.generatedBy?.username || 'Unknown'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Role</span>
                    <span className="text-sm font-medium">{healthData.generatedBy?.role || 'Unknown'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <FaExclamationTriangle className="mx-auto text-yellow-500 text-5xl mb-4" />
          <h3 className="text-xl font-medium mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Unable to fetch server health data at this time.</p>
          <button
            onClick={handleManualRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}