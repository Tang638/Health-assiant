
import { useStore } from '../store/useStore';
import { 
  BarChart3, 
  TrendingUp,
  Award,
  Calendar,
  Activity,
  Apple,
  Scale,
  Target
} from 'lucide-react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsPage() {
  const activities = useStore((state) => state.activities);
  const dietRecords = useStore((state) => state.dietRecords);
  const achievements = useStore((state) => state.achievements);
  const goals = useStore((state) => state.goals);

  const monthlyActivities = activities.filter(a => {
    const date = new Date(a.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const monthlyDiet = dietRecords.filter(d => {
    const date = new Date(d.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  });

  const totalActivities = activities.length;
  const totalDietRecords = dietRecords.length;
  const totalCaloriesBurned = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalCaloriesIntake = dietRecords.reduce((sum, d) => sum + d.calories * d.quantity, 0);
  const achievedCount = achievements.filter(a => a.achievedAt).length;
  const goalProgress = goals.reduce((sum, g) => sum + (g.currentValue / g.targetValue), 0) / goals.length * 100;

  const weeklyLabels = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  const weeklyActivityData = [300, 450, 200, 500, 350, 600, 400];
  const weeklyDietData = [1800, 2200, 1900, 2100, 2000, 2300, 1800];

  const lineChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: '运动消耗',
        data: weeklyActivityData,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: '饮食摄入',
        data: weeklyDietData,
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const barChartData = {
    labels: weeklyLabels,
    datasets: [
      {
        label: '运动时长(分钟)',
        data: [30, 45, 20, 50, 35, 60, 40],
        backgroundColor: '#10B981',
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['蛋白质', '碳水化合物', '脂肪'],
    datasets: [
      {
        data: [30, 45, 25],
        backgroundColor: ['#EF4444', '#EAB308', '#3B82F6'],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
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

  const barOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      y: {
        ...chartOptions.scales?.y,
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">数据报表</h1>
          <p className="text-gray-500">查看您的健康数据统计和分析报告</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-gray-600">2024年1月</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-gray-500 text-sm">运动记录</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalActivities} <span className="text-sm font-normal text-gray-500">次</span></p>
          <p className="text-xs text-green-600 mt-1">本月 {monthlyActivities.length} 次</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Apple className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-gray-500 text-sm">饮食记录</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{totalDietRecords} <span className="text-sm font-normal text-gray-500">次</span></p>
          <p className="text-xs text-green-600 mt-1">本月 {monthlyDiet.length} 次</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-gray-500 text-sm">卡路里差</span>
          </div>
          <p className={`text-2xl font-bold ${totalCaloriesBurned > totalCaloriesIntake ? 'text-green-600' : 'text-red-600'}`}>
            {totalCaloriesBurned > totalCaloriesIntake ? '-' : '+'}
            {Math.abs(totalCaloriesBurned - totalCaloriesIntake).toLocaleString()}
            <span className="text-sm font-normal text-gray-500"> 千卡</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">消耗 {totalCaloriesBurned.toLocaleString()} / 摄入 {totalCaloriesIntake.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-gray-500 text-sm">成就达成</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">{achievedCount} <span className="text-sm font-normal text-gray-500">个</span></p>
          <p className="text-xs text-amber-600 mt-1">共 {achievements.length} 个成就</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">本周热量摄入与消耗</h2>
            <TrendingUp className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="h-64">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">营养成分比例</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="w-full max-w-[200px]">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">本周运动时长</h2>
          <div className="h-64">
            <Bar data={barChartData} options={barOptions} />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">目标进度</h2>
          <div className="space-y-4">
            {goals.map((goal) => {
              const progress = Math.min(100, (goal.currentValue / goal.targetValue) * 100);
              return (
                <div key={goal.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-700">
                      {goal.type === 'steps' ? '每日步数' : 
                       goal.type === 'calories' ? '每日卡路里' : 
                       goal.type === 'weight' ? '目标体重' : '运动目标'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {goal.currentValue.toLocaleString()} / {goal.targetValue.toLocaleString()} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progress.toFixed(1)}% 完成</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">总体目标进度</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">{goalProgress.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">成就展示</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-xl text-center ${
                achievement.achievedAt 
                  ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200' 
                  : 'bg-gray-50 opacity-50'
              }`}
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <p className="font-medium text-gray-800 text-sm">{achievement.name}</p>
              <p className="text-xs text-gray-500 mt-1">{achievement.description}</p>
              {achievement.achievedAt && (
                <p className="text-xs text-green-600 mt-2">已达成</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
