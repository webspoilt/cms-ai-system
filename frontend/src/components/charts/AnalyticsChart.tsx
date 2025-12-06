'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { useState } from 'react';

interface AnalyticsChartProps {
  data?: Array<{
    date: string;
    views: number;
    uniqueViews: number;
    bounceRate: number;
  }>;
  showComparison?: boolean;
}

// Mock data for demonstration
const mockData = [
  { date: '2024-01-01', views: 2400, uniqueViews: 1800, bounceRate: 35 },
  { date: '2024-01-02', views: 1398, uniqueViews: 1100, bounceRate: 32 },
  { date: '2024-01-03', views: 9800, uniqueViews: 7200, bounceRate: 28 },
  { date: '2024-01-04', views: 3908, uniqueViews: 2900, bounceRate: 30 },
  { date: '2024-01-05', views: 4800, uniqueViews: 3500, bounceRate: 33 },
  { date: '2024-01-06', views: 3800, uniqueViews: 2800, bounceRate: 29 },
  { date: '2024-01-07', views: 4300, uniqueViews: 3100, bounceRate: 31 },
];

export function AnalyticsChart({ data = mockData, showComparison = false }: AnalyticsChartProps) {
  const [view, setView] = useState<'views' | 'unique' | 'bounce'>('views');
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTooltip = (value: any, name: string) => {
    if (name === 'bounceRate') {
      return [`${value}%`, 'Bounce Rate'];
    }
    return [value.toLocaleString(), name === 'views' ? 'Page Views' : 'Unique Views'];
  };

  const getLineColor = () => {
    switch (view) {
      case 'views': return '#00E5FF';
      case 'unique': return '#7F56D9';
      case 'bounce': return '#10B981';
      default: return '#00E5FF';
    }
  };

  const getDataKey = () => {
    switch (view) {
      case 'views': return 'views';
      case 'unique': return 'uniqueViews';
      case 'bounce': return 'bounceRate';
      default: return 'views';
    }
  };

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-1 bg-neutral-800 rounded-secondary p-1">
          <button
            onClick={() => setView('views')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === 'views'
                ? 'bg-primary-500 text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Views
          </button>
          <button
            onClick={() => setView('unique')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === 'unique'
                ? 'bg-primary-500 text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Unique
          </button>
          <button
            onClick={() => setView('bounce')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              view === 'bounce'
                ? 'bg-primary-500 text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Bounce
          </button>
        </div>

        <div className="flex space-x-1 bg-neutral-800 rounded-secondary p-1">
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              chartType === 'line'
                ? 'bg-primary-500 text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('area')}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
              chartType === 'area'
                ? 'bg-primary-500 text-neutral-950'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            Area
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#A1A1AA"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => view === 'bounce' ? `${value}%` : value.toLocaleString()}
                stroke="#A1A1AA"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: '#141414',
                  border: '1px solid #1E1E1E',
                  borderRadius: '8px',
                  color: '#E4E4E7',
                }}
              />
              <Line 
                type="monotone" 
                dataKey={getDataKey()} 
                stroke={getLineColor()}
                strokeWidth={2}
                dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: getLineColor() }}
              />
            </LineChart>
          ) : (
            <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getLineColor()} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={getLineColor()} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#A1A1AA"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => view === 'bounce' ? `${value}%` : value.toLocaleString()}
                stroke="#A1A1AA"
                fontSize={12}
              />
              <Tooltip 
                formatter={formatTooltip}
                labelFormatter={(label) => formatDate(label)}
                contentStyle={{
                  backgroundColor: '#141414',
                  border: '1px solid #1E1E1E',
                  borderRadius: '8px',
                  color: '#E4E4E7',
                }}
              />
              <Area
                type="monotone"
                dataKey={getDataKey()}
                stroke={getLineColor()}
                strokeWidth={2}
                fill="url(#colorGradient)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-neutral-800">
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-100">
            {data[data.length - 1]?.views.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-neutral-400">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-100">
            {data[data.length - 1]?.uniqueViews.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-neutral-400">Unique Visitors</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-100">
            {data[data.length - 1]?.bounceRate || 0}%
          </div>
          <div className="text-sm text-neutral-400">Bounce Rate</div>
        </div>
      </div>
    </div>
  );
}