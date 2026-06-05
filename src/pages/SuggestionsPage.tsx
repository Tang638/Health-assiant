
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Lightbulb, 
  Activity, 
  Apple, 
  Heart,
  RefreshCw,
  ChevronRight
} from 'lucide-react';

export default function SuggestionsPage() {
  const navigate = useNavigate();
  const suggestions = useStore((state) => state.suggestions);
  const generateSuggestions = useStore((state) => state.generateSuggestions);
  const activities = useStore((state) => state.activities);
  const dietRecords = useStore((state) => state.dietRecords);

  const weeklyActivities = activities.filter(a => {
    const date = new Date(a.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const weeklyCaloriesBurned = weeklyActivities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const weeklyDietCalories = dietRecords.reduce((sum, d) => sum + d.calories * d.quantity, 0);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return Activity;
      case 'diet':
        return Apple;
      case 'health':
        return Heart;
      default:
        return Lightbulb;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'exercise':
        return 'from-orange-500 to-red-500';
      case 'diet':
        return 'from-green-500 to-emerald-500';
      case 'health':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-purple-500 to-pink-500';
    }
  };

  const tips = [
    {
      icon: Activity,
      title: '运动小贴士',
      content: '每周至少进行150分钟中等强度有氧运动，有助于保持心血管健康。',
      color: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
    {
      icon: Apple,
      title: '饮食建议',
      content: '每餐保证蛋白质、碳水和健康脂肪的均衡摄入，控制总热量。',
      color: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      icon: Heart,
      title: '健康提醒',
      content: '保持充足的睡眠（7-8小时/晚）对身体恢复至关重要。',
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">智能建议</h1>
          <p className="text-gray-500">基于您的健康数据，为您提供个性化建议</p>
        </div>
        <button
          onClick={generateSuggestions}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all"
        >
          <RefreshCw className="w-5 h-5" />
          刷新建议
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">个性化建议</h2>
          {suggestions.map((suggestion) => {
            const Icon = getSuggestionIcon(suggestion.type);
            return (
              <div 
                key={suggestion.id} 
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-r ${getSuggestionColor(suggestion.type)} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {suggestion.priority === 'high' ? '重要' :
                         suggestion.priority === 'medium' ? '中等' : '一般'}
                      </span>
                      <h3 className="font-semibold text-gray-800">{suggestion.title}</h3>
                    </div>
                    <p className="text-gray-600">{suggestion.content}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-yellow-500 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-8 h-8" />
              <h2 className="text-lg font-semibold">本周数据概览</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-amber-100 text-sm">本周运动消耗</p>
                <p className="text-3xl font-bold">{weeklyCaloriesBurned.toLocaleString()} <span className="text-lg">千卡</span></p>
              </div>
              <div>
                <p className="text-amber-100 text-sm">本周饮食摄入</p>
                <p className="text-3xl font-bold">{weeklyDietCalories.toLocaleString()} <span className="text-lg">千卡</span></p>
              </div>
              <div className="pt-4 border-t border-amber-400">
                <p className="text-amber-100 text-sm">热量差</p>
                <p className={`text-2xl font-bold ${weeklyDietCalories - weeklyCaloriesBurned > 0 ? 'text-red-200' : 'text-green-200'}`}>
                  {weeklyDietCalories - weeklyCaloriesBurned > 0 ? '+' : ''}
                  {(weeklyDietCalories - weeklyCaloriesBurned).toLocaleString()} <span className="text-base">千卡</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">健康小贴士</h2>
            <div className="space-y-4">
              {tips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-10 h-10 ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${tip.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">{tip.title}</h3>
                      <p className="text-gray-500 text-sm mt-1">{tip.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
            <div className="text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="font-semibold mb-2">今日目标</h3>
              <p className="text-emerald-100 text-sm">坚持记录，每天进步一点点！</p>
              <button 
                onClick={() => navigate('/profile')}
                className="mt-4 px-4 py-2 bg-white/20 backdrop-blur rounded-lg hover:bg-white/30 transition-all text-sm"
              >
                查看我的目标
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
