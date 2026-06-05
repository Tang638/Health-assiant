import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Calendar, Clock, Flame, MapPin, Trash2, Edit3, X, Loader2 } from 'lucide-react';

const activityTypes = ['跑步', '健身', '游泳', '骑行', '瑜伽', '篮球', '足球', '网球'];

export default function ActivityPage() {
  const activities = useStore((state) => state.activities);
  const fetchActivities = useStore((state) => state.fetchActivities);
  const addActivity = useStore((state) => state.addActivity);
  const updateActivity = useStore((state) => state.updateActivity);
  const deleteActivity = useStore((state) => state.deleteActivity);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);
  
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: '跑步',
    durationMinutes: 30,
    caloriesBurned: 300,
    distanceKm: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    fetchActivities();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = async () => {
    if (editingId) {
      await updateActivity(editingId, {
        type: formData.type,
        durationMinutes: formData.durationMinutes,
        caloriesBurned: formData.caloriesBurned,
        distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
        date: formData.date,
        notes: formData.notes || undefined,
      });
    } else {
      await addActivity({
        type: formData.type,
        durationMinutes: formData.durationMinutes,
        caloriesBurned: formData.caloriesBurned,
        distanceKm: formData.distanceKm ? parseFloat(formData.distanceKm) : undefined,
        date: formData.date,
        notes: formData.notes || undefined,
      });
    }
    setShowModal(false);
    setEditingId(null);
    setFormData({
      type: '跑步',
      durationMinutes: 30,
      caloriesBurned: 300,
      distanceKm: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    });
  };

  const handleDelete = async (id: string) => {
    await deleteActivity(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">运动记录</h1>
          <p className="text-gray-500">记录您的运动数据，追踪健身进度</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
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

      {isLoading && activities.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mr-2" />
          <span className="text-gray-500">加载中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Flame className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{activity.type}</h3>
                    <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => {
                      setEditingId(activity.id);
                      setFormData({
                        type: activity.type,
                        durationMinutes: activity.durationMinutes,
                        caloriesBurned: activity.caloriesBurned,
                        distanceKm: activity.distanceKm?.toString() || '',
                        date: activity.date,
                        notes: activity.notes || '',
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDelete(activity.id)}
                    disabled={isLoading}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{activity.durationMinutes} 分钟</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{activity.caloriesBurned} 千卡</span>
                </div>
                {activity.distanceKm && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{activity.distanceKm} 公里</span>
                  </div>
                )}
                {activity.notes && (
                  <p className="text-gray-500 mt-2">{activity.notes}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Flame className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">暂无运动记录</h3>
          <p className="text-gray-500 mb-4">点击上方按钮添加您的第一条运动记录</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
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
                {editingId ? '编辑运动记录' : '添加运动记录'}
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
                <label className="block text-sm font-medium text-gray-700 mb-2">运动类型</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">运动时长(分钟)</label>
                  <input
                    type="number"
                    value={formData.durationMinutes}
                    onChange={(e) => setFormData({ ...formData, durationMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">消耗卡路里</label>
                  <input
                    type="number"
                    value={formData.caloriesBurned}
                    onChange={(e) => setFormData({ ...formData, caloriesBurned: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">距离(公里，可选)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.distanceKm}
                  onChange={(e) => setFormData({ ...formData, distanceKm: e.target.value })}
                  placeholder="可选"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备注(可选)</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="添加备注..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
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
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all disabled:opacity-50"
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
