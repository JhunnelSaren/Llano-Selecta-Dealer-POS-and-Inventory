import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  Award, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Edit, 
  X, 
  MapPin, 
  BarChart3, 
  ArrowUpRight, 
  Clock, 
  Zap,
  ChevronRight
} from 'lucide-react';
import { formatPHP } from '../utils/helpers';

export default function Quota() {
  // Current Active Quota Configuration
  const [currentQuota, setCurrentQuota] = useState({
    month: 'October 2026',
    targetAmount: 1000000.00, // ₱1,000,000 SELECTA Quota
    currentSales: 735500.00,  // ₱735,500 achieved so far
    daysInMonth: 31,
    daysElapsed: 9,
    daysRemaining: 22
  });

  // Calculate quota metrics
  const remainingAmount = Math.max(0, currentQuota.targetAmount - currentQuota.currentSales);
  const percentageAchieved = ((currentQuota.currentSales / currentQuota.targetAmount) * 100).toFixed(2);
  const averageDailySales = (currentQuota.currentSales / currentQuota.daysElapsed);
  const requiredDailySales = currentQuota.daysRemaining > 0 
    ? (remainingAmount / currentQuota.daysRemaining) 
    : 0;

  // Pace status: Are we ahead or behind required daily pacing?
  const isAheadOfPace = averageDailySales >= (currentQuota.targetAmount / currentQuota.daysInMonth);

  // Area contribution breakdown
  const areaContributions = [
    { area: 'Valencia City', sales: 285000.00, share: '38.7%' },
    { area: 'San Fernando', sales: 162000.00, share: '22.0%' },
    { area: 'Cabanglasan', sales: 140500.00, share: '19.1%' },
    { area: 'Batangan', sales: 85000.00, share: '11.6%' },
    { area: 'San Isidro & Lumabayo', sales: 63000.00, share: '8.6%' },
  ];

  // Quota History
  const [quotaHistory, setQuotaHistory] = useState([
    { month: 'September 2026', target: 950000.00, achieved: 982000.00, percentage: '103.37%', status: 'Exceeded' },
    { month: 'August 2026', target: 900000.00, achieved: 891000.00, percentage: '99.00%', status: 'Achieved' },
    { month: 'July 2026', target: 900000.00, achieved: 820000.00, percentage: '91.11%', status: 'Missed' },
  ]);

  // Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState(currentQuota.targetAmount);

  const handleUpdateTarget = () => {
    setCurrentQuota({
      ...currentQuota,
      targetAmount: parseFloat(newTarget) || 0
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SELECTA Monthly Quota Dashboard</h1>
          <p className="text-sm text-slate-500">Track dealer sales target progress, pacing metrics & area contribution</p>
        </div>
        <button 
          onClick={() => {
            setNewTarget(currentQuota.targetAmount);
            setIsModalOpen(true);
          }}
          className="btn-primary flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" /> Adjust Monthly Quota
        </button>
      </div>

      {/* Primary Quota Progress Card */}
      <div className="card bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl border-none">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-700/80 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-brand-red text-white rounded-xl shadow-lg shadow-brand-red/30">
              <Target className="w-8 h-8" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Active Quota Target</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-0.5">{currentQuota.month}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-4 py-2 rounded-xl text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Days Remaining: <strong className="text-white text-base">{currentQuota.daysRemaining} days</strong></span>
          </div>
        </div>

        {/* Progress Display */}
        <div className="my-8 space-y-3">
          <div className="flex justify-between items-end flex-wrap gap-2">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Achievement Progress</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-red">{percentageAchieved}%</div>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400">Target Goal</span>
              <div className="text-xl font-bold text-white">{formatPHP(currentQuota.targetAmount)}</div>
            </div>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-5 overflow-hidden p-1 shadow-inner border border-slate-700">
            <div 
              className="bg-gradient-to-r from-brand-red to-amber-500 h-3 rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${Math.min(100, percentageAchieved)}%` }}
            ></div>
          </div>
        </div>

        {/* Financial Numbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-700/80">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 uppercase font-semibold">Current Sales Achieved</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{formatPHP(currentQuota.currentSales)}</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 uppercase font-semibold">Remaining Target Balance</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{formatPHP(remainingAmount)}</p>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
            <p className="text-xs text-slate-400 uppercase font-semibold">Required Daily Pacing</p>
            <p className="text-2xl font-bold text-white mt-1">{formatPHP(requiredDailySales)}<span className="text-xs font-normal text-slate-400">/day</span></p>
          </div>
        </div>
      </div>

      {/* Daily Pacing & Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Pacing Card */}
        <div className="card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-800">Daily Sales Pacing Analysis</h2>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              isAheadOfPace ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isAheadOfPace ? 'Ahead of Schedule' : 'Needs Push'}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-600">Current Average Daily Sales:</span>
              <strong className="text-slate-900 font-bold">{formatPHP(averageDailySales)} / day</strong>
            </div>

            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
              <span className="text-slate-600">Required Daily Sales (Next {currentQuota.daysRemaining} days):</span>
              <strong className="text-brand-red font-bold">{formatPHP(requiredDailySales)} / day</strong>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-xs text-blue-900 space-y-1">
              <span className="font-bold block text-blue-800">Pacing Advice:</span>
              <p>
                To reach the ₱1,000,000 target by October 31, field bookers must collect an average of <strong>{formatPHP(requiredDailySales)}</strong> in bookings per day across Valencia, San Fernando, and Cabanglasan routes.
              </p>
            </div>
          </div>
        </div>

        {/* Route / Area Contribution Breakdown */}
        <div className="card space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <MapPin className="w-5 h-5 text-brand-red" />
            <h2 className="text-lg font-bold text-slate-800">Sales Contribution by Route & Area</h2>
          </div>

          <div className="space-y-3">
            {areaContributions.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{item.area}</span>
                  <span className="text-slate-900 font-bold">{formatPHP(item.sales)} ({item.share})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-brand-red h-2 rounded-full" 
                    style={{ width: item.share }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Quota Accomplishments */}
      <div className="card space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Award className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-slate-800">Historical Quota Performance</h2>
        </div>

        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Month & Year</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Target Quota</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actual Sales</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Achievement %</th>
                <th className="py-3 px-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {quotaHistory.map((q, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-bold text-slate-800">{q.month}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{formatPHP(q.target)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-slate-900">{formatPHP(q.achieved)}</td>
                  <td className="py-3 px-4 text-sm font-bold text-brand-red">{q.percentage}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      q.status === 'Exceeded' ? 'bg-emerald-100 text-emerald-800' :
                      q.status === 'Achieved' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Adjust Quota Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-red" />
                <h2 className="text-lg font-bold text-slate-800">Set Monthly SELECTA Target</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Target Month</label>
                <input 
                  type="text" 
                  disabled 
                  value={currentQuota.month} 
                  className="input-field bg-slate-100 font-bold" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Monthly Quota Amount (₱) <span className="text-brand-red">*</span></label>
                <input 
                  type="number" 
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  placeholder="e.g. 1000000" 
                  className="input-field text-lg font-bold text-slate-900" 
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">Cancel</button>
              <button onClick={handleUpdateTarget} className="btn-primary text-xs">Update Target Quota</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}