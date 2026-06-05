
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { 
  User, 
  Mail, 
  Calendar,
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Edit3,
  Save,
  X,
  ChevronRight
} from 'lucide-react';

export default function ProfilePage() {
  const user = useStore((state) => state.user);
  const goals = useStore((state) => state.goals);
  const addGoal = useStore((state) => state.addGoal);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.username || '',
    email: user?.email || '',
    birthday: '1990-01-01',
    height: 175,
  });
  const [goalForm, setGoalForm] = useState({
    type: 'steps' as 'steps' | 'calories' | 'weight' | 'exercise',
    targetValue: 10000,
    currentValue: 0,
    unit: '步',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleAddGoal = () => {
    addGoal({
      type: goalForm.type,
      targetValue: goalForm.targetValue,
      currentValue: goalForm.currentValue,
      unit: goalForm.unit,
      startDate: goalForm.startDate,
      endDate: goalForm.endDate || undefined,
      completed: false,
    });
    setShowGoalModal(false);
    setGoalForm({
      type: 'steps',
      targetValue: 10000,
      currentValue: 0,
      unit: '步',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
  };

  const goalTypeOptions = [
    { value: 'steps', label: '每日步数', defaultUnit: '步', defaultTarget: 10000 },
    { value: 'calories', label: '每日卡路里', defaultUnit: '千卡', defaultTarget: 2000 },
    { value: 'weight', label: '目标体重', defaultUnit: 'kg', defaultTarget: 65 },
    { value: 'exercise', label: '每周运动次数', defaultUnit: '次', defaultTarget: 5 },
  ];

  const handleGoalTypeChange = (type: 'steps' | 'calories' | 'weight' | 'exercise') => {
    const option = goalTypeOptions.find(o => o.value === type);
    if (option) {
      setGoalForm({
        ...goalForm,
        type,
        unit: option.defaultUnit,
        targetValue: option.defaultTarget,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">个人中心</h1>
          <p className="text-gray-500">管理您的个人资料和设置</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">个人资料</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  编辑资料
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all"
                  >
                    <Save className="w-4 h-4" />
                    保存
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <X className="w-4 h-4" />
                    取消
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <p className="text-gray-800 font-medium">{profileData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ) : (
                    <div className="flex items-center gap-2 text-gray-800">
                      <Mail className="w-4 h-4 text-gray-400" />
                      {profileData.email}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">出生日期</label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-gray-800">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {profileData.birthday}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">身高 (cm)</label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={profileData.height}
                        onChange={(e) => setProfileData({ ...profileData, height: parseInt(e.target.value) || 0 })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    ) : (
                      <p className="text-gray-800">{profileData.height} cm</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800">我的目标</h2>
              <button
                onClick={() => setShowGoalModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                添加目标
              </button>
            </div>

            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">
                        {goal.type === 'steps' ? '每日步数' :
                         goal.type === 'calories' ? '每日卡路里' :
                         goal.type === 'weight' ? '目标体重' : '运动目标'}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    {goal.endDate && (
                      <p className="text-xs text-gray-500 mt-2">目标截止: {goal.endDate}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <h3 className="font-semibold mb-4">快速链接</h3>
            <div className="space-y-3">
              {[
                { icon: Settings, label: '账户设置', desc: '管理账户信息' },
                { icon: Shield, label: '隐私安全', desc: '安全设置' },
                { icon: Bell, label: '通知偏好', desc: '消息通知' },
                { icon: HelpCircle, label: '帮助中心', desc: '获取帮助' },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={index}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all text-left"
                  >
                    <Icon className="w-5 h-5" />
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-emerald-100">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-4">关于应用</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>智能健康助手 v1.0.0</p>
              <p>帮助您管理健康数据，开启健康生活</p>
              <div className="pt-3 border-t border-gray-100">
                <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                  查看更新日志
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showGoalModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">添加目标</h2>
              <button
                onClick={() => setShowGoalModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标类型</label>
                <select
                  value={goalForm.type}
                  onChange={(e) => handleGoalTypeChange(e.target.value as 'steps' | 'calories' | 'weight' | 'exercise')}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {goalTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">目标值 ({goalForm.unit})</label>
                <input
                  type="number"
                  value={goalForm.targetValue}
                  onChange={(e) => setGoalForm({ ...goalForm, targetValue: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">开始日期</label>
                  <input
                    type="date"
                    value={goalForm.startDate}
                    onChange={(e) => setGoalForm({ ...goalForm, startDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">截止日期 (可选)</label>
                  <input
                    type="date"
                    value={goalForm.endDate}
                    onChange={(e) => setGoalForm({ ...goalForm, endDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowGoalModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleAddGoal}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all"
              >
                添加目标
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
