
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Apple, 
  Scale, 
  TrendingUp,
  Heart,
  Footprints,
  Flame,
  ArrowUpRight,
  Target,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const navigate = useNavigate();
  const activities = useStore((state) => state.activities);
  const dietRecords = useStore((state) => state.dietRecords);
  const weightRecords = useStore((state) => state.weightRecords);
  const goals = useStore((state) => state.goals);
  const suggestions = useStore((state) => state.suggestions);

  const todayActivities = activities.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const todayDiet = dietRecords.filter(d => d.date === new Date().toISOString().split('T')[0]);
  
  const totalCaloriesBurned = activities.slice(0, 7).reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalCaloriesIntake = todayDiet.reduce((sum, d) => sum + d.calories * d.quantity, 0);
  const latestWeight = weightRecords[0]?.weight || 0;
  const stepsGoal = goals.find(g => g.type === 'steps');
  const stepsProgress = stepsGoal ? Math.round((stepsGoal.currentValue / stepsGoal.targetValue) * 100) : 0;

  const chartData = {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '卡路里消耗',
        data: [300, 450, 200, 500, 350, 600, totalCaloriesBurned],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
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

  const statCards = [
    {
      title: '今日步数',
      value: stepsGoal?.currentValue?.toLocaleString() || '0',
      unit: '步',
      progress: stepsProgress,
      icon: Footprints,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      link: '/activities',
    },
    {
      title: '卡路里消耗',
      value: totalCaloriesBurned.toLocaleString(),
      unit: '千卡',
      progress: Math.min(100, Math.round((totalCaloriesBurned / 2000) * 100)),
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      link: '/activities',
    },
    {
      title: '卡路里摄入',
      value: totalCaloriesIntake.toLocaleString(),
      unit: '千卡',
      progress: Math.min(100, Math.round((totalCaloriesIntake / 2000) * 100)),
      icon: Apple,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      link: '/diet',
    },
    {
      title: '当前体重',
      value: latestWeight.toFixed(1),
      unit: 'kg',
      progress: 0,
      icon: Scale,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      link: '/weight',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">仪表板</h1>
          <p className="text-gray-500">欢迎回来！以下是您的健康数据概览</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full">
          <Heart className="w-5 h-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700">今日状态良好</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              onClick={() => navigate(card.link)}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <div className="mb-2">
                <span className="text-3xl font-bold text-gray-800">{card.value}</span>
                <span className="text-gray-500 ml-1">{card.unit}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">{card.title}</p>
              {card.progress > 0 && (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`bg-gradient-to-r ${card.color} h-2 rounded-full transition-all`}
                    style={{ width: `${card.progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">本周运动趋势</h2>
              <p className="text-sm text-gray-500">卡路里消耗统计</p>
            </div>
            <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
              查看详情
            </button>
          </div>
          <div className="h-64">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">智能建议</h2>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="space-y-4">
            {suggestions.slice(0, 3).map((suggestion) => (
              <div key={suggestion.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                    suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {suggestion.priority === 'high' ? '重要' :
                     suggestion.priority === 'medium' ? '中等' : '一般'}
                  </span>
                  <span className="font-medium text-gray-800 text-sm">{suggestion.title}</span>
                </div>
                <p className="text-sm text-gray-600">{suggestion.content}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            查看更多建议
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">今日目标</h2>
              <p className="text-amber-100 text-sm">坚持记录，每天进步一点点！</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/20 rounded-full">
            <Clock className="w-4 h-4" />
            <span className="text-sm">今日</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => {
            const progress = Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100));
            const isCompleted = progress >= 100;
            return (
              <div key={goal.id} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-sm">{goal.type === 'steps' ? '每日步数' : 
                      goal.type === 'calories' ? '每日卡路里' :
                      goal.type === 'weight' ? '目标体重' : '运动目标'}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                  ) : (
                    <Target className="w-5 h-5 text-amber-200" />
                  )}
                </div>
                <div className="text-2xl font-bold mb-1">
                  {goal.currentValue.toLocaleString()}
                  <span className="text-sm font-normal text-amber-200 ml-1">{goal.unit}</span>
                </div>
                <p className="text-amber-100 text-xs mb-3">目标: {goal.targetValue.toLocaleString()} {goal.unit}</p>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${isCompleted ? 'bg-green-400' : 'bg-white'}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className={`text-xs mt-2 ${isCompleted ? 'text-green-300' : 'text-amber-200'}`}>
                  {isCompleted ? '🎉 已完成' : `${progress}% 完成`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">今日运动记录</h2>
            <button 
              onClick={() => navigate('/activities')}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Activity className="w-4 h-4" />
              添加记录
            </button>
          </div>
          {todayActivities.length > 0 ? (
            <div className="space-y-3">
              {todayActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{activity.type}</p>
                      <p className="text-sm text-gray-500">{activity.durationMinutes}分钟 · {activity.caloriesBurned}千卡</p>
                    </div>
                  </div>
                  {activity.notes && (
                    <span className="text-xs text-gray-400">{activity.notes}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>今日暂无运动记录</p>
              <button 
                onClick={() => navigate('/activities')}
                className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
              >
                添加运动记录
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">今日饮食摄入</h2>
            <button 
              onClick={() => navigate('/diet')}
              className="flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
            >
              <Apple className="w-4 h-4" />
              添加记录
            </button>
          </div>
          {todayDiet.length > 0 ? (
            <div className="space-y-3">
              {todayDiet.map((diet) => (
                <div key={diet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Apple className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{diet.foodName}</p>
                      <p className="text-sm text-gray-500">{(diet.calories * diet.quantity).toFixed(0)}千卡 · {diet.quantity}份</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    diet.mealType === 'breakfast' ? 'bg-yellow-100 text-yellow-600' :
                    diet.mealType === 'lunch' ? 'bg-orange-100 text-orange-600' :
                    diet.mealType === 'dinner' ? 'bg-purple-100 text-purple-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {diet.mealType === 'breakfast' ? '早餐' :
                     diet.mealType === 'lunch' ? '午餐' :
                     diet.mealType === 'dinner' ? '晚餐' : '加餐'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Apple className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>今日暂无饮食记录</p>
              <button 
                onClick={() => navigate('/diet')}
                className="mt-2 text-sm text-emerald-600 hover:text-emerald-700"
              >
                添加饮食记录
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
