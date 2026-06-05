import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { 
  Plus, 
  Calendar, 
  Trash2,
  Edit3,
  X,
  Scale,
  Activity,
  Loader2
} from 'lucide-react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend);

export default function WeightPage() {
  const weightRecords = useStore((state) => state.weightRecords);
  const fetchWeightRecords = useStore((state) => state.fetchWeightRecords);
  const addWeightRecord = useStore((state) => state.addWeightRecord);
  const updateWeightRecord = useStore((state) => state.updateWeightRecord);
  const deleteWeightRecord = useStore((state) => state.deleteWeightRecord);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    weight: 70,
    bodyFatPercentage: '',
    muscleMass: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchWeightRecords();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async () => {
    if (editingId) {
      await updateWeightRecord(editingId, {
        weight: formData.weight,
        bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
        date: formData.date,
      });
    } else {
      await addWeightRecord({
        weight: formData.weight,
        bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
        muscleMass: formData.muscleMass ? parseFloat(formData.muscleMass) : undefined,
        date: formData.date,
      });
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({
      weight: 70,
      bodyFatPercentage: '',
      muscleMass: '',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const handleDelete = async (id: string) => {
    await deleteWeightRecord(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const sortedRecords = [...weightRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const chartData = {
    labels: sortedRecords.slice(0, 10).reverse().map(record => formatDate(record.date)),
    datasets: [
      {
        label: '体重 (kg)',
        data: sortedRecords.slice(0, 10).reverse().map(record => record.weight),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '体重变化趋势',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">体重记录</h1>
          <p className="text-gray-500">记录您的体重变化，追踪健康目标</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          添加记录
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-red-500 hover:text-red-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isLoading && weightRecords.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin mr-2" />
          <span className="text-gray-500">加载中...</span>
        </div>
      ) : (
        <>
          {sortedRecords.length >= 2 && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
              <Line data={chartData} options={chartOptions} />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Scale className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{record.weight} kg</h3>
                      <p className="text-sm text-gray-500">{formatDate(record.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => {
                        setEditingId(record.id);
                        setFormData({
                          weight: record.weight,
                          bodyFatPercentage: record.bodyFatPercentage?.toString() || '',
                          muscleMass: record.muscleMass?.toString() || '',
                          date: record.date,
                        });
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(record.id)}
                      disabled={isLoading}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  {record.bodyFatPercentage && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Activity className="w-4 h-4 text-orange-500" />
                      <span>体脂率: {record.bodyFatPercentage}%</span>
                    </div>
                  )}
                  {record.muscleMass && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Scale className="w-4 h-4 text-blue-500" />
                      <span>肌肉量: {record.muscleMass} kg</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {weightRecords.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Scale className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">暂无体重记录</h3>
          <p className="text-gray-500 mb-4">点击上方按钮添加您的第一条体重记录</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            添加记录
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {editingId ? '编辑体重记录' : '添加体重记录'}
              </h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">体重 (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">体脂率 (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.bodyFatPercentage}
                    onChange={(e) => setFormData({ ...formData, bodyFatPercentage: e.target.value })}
                    placeholder="可选"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">肌肉量 (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.muscleMass}
                    onChange={(e) => setFormData({ ...formData, muscleMass: e.target.value })}
                    placeholder="可选"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                }}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
              >
                {isLoading ? '保存中...' : (editingId ? '保存修改' : '添加记录')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
