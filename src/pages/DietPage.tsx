import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Plus, Calendar, Apple, Beef, Wheat, Droplets, Trash2, X, Search, Flame, PlusCircle, MinusCircle, Loader2 } from 'lucide-react';

interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

interface SelectedFood {
  food: FoodItem;
  weight: number;
}

const mealTypes = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
];

const foodCategories = ['主食', '肉类', '蛋类', '奶制品', '豆制品', '蔬菜', '水果', '油脂', '坚果'];

const foodDatabase: FoodItem[] = [
  { name: '白米饭', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: '主食' },
  { name: '糙米饭', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: '主食' },
  { name: '燕麦粥', calories: 68, protein: 2.4, carbs: 12, fat: 1.2, category: '主食' },
  { name: '全麦面包', calories: 260, protein: 8, carbs: 48, fat: 3, category: '主食' },
  { name: '馒头', calories: 223, protein: 7, carbs: 47, fat: 1.1, category: '主食' },
  { name: '面条', calories: 130, protein: 3.5, carbs: 28, fat: 0.5, category: '主食' },
  { name: '玉米', calories: 116, protein: 4, carbs: 25, fat: 1.2, category: '主食' },
  { name: '红薯', calories: 86, protein: 1.6, carbs: 20, fat: 0.2, category: '主食' },
  { name: '鸡胸肉', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: '肉类' },
  { name: '瘦牛肉', calories: 125, protein: 26, carbs: 0, fat: 2.4, category: '肉类' },
  { name: '鱼肉', calories: 120, protein: 25, carbs: 0, fat: 2, category: '肉类' },
  { name: '鸡蛋', calories: 143, protein: 13, carbs: 1.1, fat: 10, category: '蛋类' },
  { name: '牛奶', calories: 54, protein: 3.2, carbs: 5, fat: 3.2, category: '奶制品' },
  { name: '酸奶', calories: 80, protein: 2.5, carbs: 11, fat: 3, category: '奶制品' },
  { name: '豆腐', calories: 70, protein: 6.2, carbs: 2, fat: 4.8, category: '豆制品' },
  { name: '豆浆', calories: 30, protein: 2.4, carbs: 2, fat: 1.2, category: '豆制品' },
  { name: '西兰花', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: '蔬菜' },
  { name: '菠菜', calories: 23, protein: 2.9, carbs: 4, fat: 0.4, category: '蔬菜' },
  { name: '番茄', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: '蔬菜' },
  { name: '黄瓜', calories: 15, protein: 0.8, carbs: 2.9, fat: 0.2, category: '蔬菜' },
  { name: '苹果', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: '水果' },
  { name: '香蕉', calories: 91, protein: 1.1, carbs: 23, fat: 0.3, category: '水果' },
  { name: '橙子', calories: 47, protein: 1, carbs: 12, fat: 0.2, category: '水果' },
  { name: '草莓', calories: 32, protein: 0.7, carbs: 8, fat: 0.3, category: '水果' },
  { name: '橄榄油', calories: 884, protein: 0, carbs: 0, fat: 100, category: '油脂' },
  { name: '花生油', calories: 899, protein: 0, carbs: 0, fat: 100, category: '油脂' },
  { name: '核桃', calories: 654, protein: 15, carbs: 14, fat: 65, category: '坚果' },
  { name: '杏仁', calories: 575, protein: 20, carbs: 22, fat: 49, category: '坚果' },
];

export default function DietPage() {
  const dietRecords = useStore((state) => state.dietRecords);
  const fetchDietRecords = useStore((state) => state.fetchDietRecords);
  const addDietRecord = useStore((state) => state.addDietRecord);
  const deleteDietRecord = useStore((state) => state.deleteDietRecord);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const clearError = useStore((state) => state.clearError);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedFoods, setSelectedFoods] = useState<SelectedFood[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchDietRecords();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || food.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addFoodToSelection = (food: FoodItem) => {
    const existing = selectedFoods.find(s => s.food.name === food.name);
    if (existing) {
      setSelectedFoods(selectedFoods.map(s => 
        s.food.name === food.name 
          ? { ...s, weight: s.weight + 100 } 
          : s
      ));
    } else {
      setSelectedFoods([...selectedFoods, { food, weight: 100 }]);
    }
  };

  const updateFoodWeight = (index: number, weight: number) => {
    const updated = [...selectedFoods];
    updated[index] = { ...updated[index], weight: Math.max(10, weight) };
    setSelectedFoods(updated);
  };

  const removeFoodFromSelection = (index: number) => {
    setSelectedFoods(selectedFoods.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    return selectedFoods.reduce((acc, item) => {
      const ratio = item.weight / 100;
      return {
        calories: acc.calories + (item.food.calories * ratio),
        protein: acc.protein + (item.food.protein * ratio),
        carbs: acc.carbs + (item.food.carbs * ratio),
        fat: acc.fat + (item.food.fat * ratio),
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };

  const handleSubmit = async () => {
    const totals = calculateTotals();
    
    for (const item of selectedFoods) {
      const ratio = item.weight / 100;
      await addDietRecord({
        foodName: item.food.name,
        calories: Math.round(item.food.calories * ratio),
        protein: Math.round(item.food.protein * ratio * 10) / 10,
        carbs: Math.round(item.food.carbs * ratio * 10) / 10,
        fat: Math.round(item.food.fat * ratio * 10) / 10,
        quantity: item.weight,
        mealType: selectedMealType as 'breakfast' | 'lunch' | 'dinner' | 'snack',
        date,
      });
    }
    
    setShowModal(false);
    setSelectedFoods([]);
    setSelectedMealType('breakfast');
    setDate(new Date().toISOString().split('T')[0]);
    setSearchQuery('');
    setSelectedCategory('');
  };

  const handleDelete = async (id: string) => {
    await deleteDietRecord(id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  const getMealLabel = (mealType: string) => {
    return mealTypes.find(m => m.value === mealType)?.label || mealType;
  };

  const totals = calculateTotals();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">饮食记录</h1>
          <p className="text-gray-500">记录您的饮食摄入，追踪营养目标</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
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

      {isLoading && dietRecords.length === 0 ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin mr-2" />
          <span className="text-gray-500">加载中...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dietRecords.map((record) => (
            <div key={record.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Apple className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{record.foodName}</h3>
                    <p className="text-sm text-gray-500">{getMealLabel(record.mealType)} · {formatDate(record.date)}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(record.id)}
                  disabled={isLoading}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Flame className="w-4 h-4 text-red-500" />
                  <span>{record.calories} 千卡</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Beef className="w-4 h-4 text-pink-500" />
                  <span>蛋白质: {record.protein}g</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Wheat className="w-4 h-4 text-yellow-500" />
                  <span>碳水: {record.carbs}g</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Droplets className="w-4 h-4 text-blue-500" />
                  <span>脂肪: {record.fat}g</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Apple className="w-4 h-4 text-green-500" />
                  <span>重量: {record.quantity}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {dietRecords.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Apple className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">暂无饮食记录</h3>
          <p className="text-gray-500 mb-4">点击上方按钮添加您的第一条饮食记录</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all"
          >
            添加记录
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">添加饮食记录</h2>
              <button 
                onClick={() => {
                  setShowModal(false);
                  setSelectedFoods([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">餐次类型</label>
                <select
                  value={selectedMealType}
                  onChange={(e) => setSelectedMealType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {mealTypes.map((meal) => (
                    <option key={meal.value} value={meal.value}>{meal.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">选择食物</h3>
              
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索食物..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">全部分类</option>
                  {foodCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto mb-4">
                {filteredFoods.map((food) => (
                  <button
                    key={food.name}
                    onClick={() => addFoodToSelection(food)}
                    className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-all text-left"
                  >
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Apple className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{food.name}</p>
                      <p className="text-sm text-gray-500">{food.calories} 千卡/100g</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedFoods.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">已选食物</h3>
                <div className="space-y-3">
                  {selectedFoods.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Apple className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{item.food.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.food.calories}千卡/100g · {item.food.protein}g蛋白 · {item.food.carbs}g碳水 · {item.food.fat}g脂肪
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateFoodWeight(index, item.weight - 10)}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={item.weight}
                            onChange={(e) => updateFoodWeight(index, parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                          <button
                            onClick={() => updateFoodWeight(index, item.weight + 10)}
                            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                          <span className="text-sm text-gray-500">g</span>
                        </div>
                        <button
                          onClick={() => removeFoodFromSelection(index)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                  <h4 className="font-medium text-gray-800 mb-3">营养总计</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-600">{Math.round(totals.calories)}</p>
                      <p className="text-sm text-gray-500">千卡</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">{Math.round(totals.protein * 10) / 10}</p>
                      <p className="text-sm text-gray-500">蛋白质(g)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-600">{Math.round(totals.carbs * 10) / 10}</p>
                      <p className="text-sm text-gray-500">碳水(g)</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{Math.round(totals.fat * 10) / 10}</p>
                      <p className="text-sm text-gray-500">脂肪(g)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedFoods([]);
                }}
                className="flex-1 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || selectedFoods.length === 0}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all disabled:opacity-50"
              >
                {isLoading ? '保存中...' : '添加记录'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
