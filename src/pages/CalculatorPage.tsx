import React, { useState } from 'react';
import { 
  Calculator, 
  Square, 
  Box, 
  Layers, 
  ArrowRight, 
  Copy, 
  Plus, 
  Check,
  RotateCcw,
  Ruler,
  Grid3X3
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Project, Material, UNITS, MATERIAL_CATEGORIES, LAYOUT_DIRECTIONS } from '@/types';
import { toast } from 'sonner';

interface CalculatorPageProps {
  projects: Project[];
  onAddMaterialToProject: (projectId: number, material: Material) => void;
}

type CalculatorTab = 'area' | 'volume' | 'material' | 'layout' | 'custom';

export const CalculatorPage: React.FC<CalculatorPageProps> = ({ projects, onAddMaterialToProject }) => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>('area');
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [pendingMaterial, setPendingMaterial] = useState<{ name: string; value: string; unit: string } | null>(null);

  // Area calculator state
  const [areaLength, setAreaLength] = useState('');
  const [areaWidth, setAreaWidth] = useState('');
  const [areaResult, setAreaResult] = useState<string | null>(null);

  // Volume calculator state
  const [volumeLength, setVolumeLength] = useState('');
  const [volumeWidth, setVolumeWidth] = useState('');
  const [volumeHeight, setVolumeHeight] = useState('');
  const [volumeResult, setVolumeResult] = useState<string | null>(null);

  // Material calculator state
  const [materialArea, setMaterialArea] = useState('');
  const [materialSize, setMaterialSize] = useState('');
  const [materialGap, setMaterialGap] = useState('0');
  const [materialReserve, setMaterialReserve] = useState('10');
  const [materialResult, setMaterialResult] = useState<string | null>(null);

  // Layout calculator state
  const [layoutRoomSize, setLayoutRoomSize] = useState('');
  const [layoutProfileLength, setLayoutProfileLength] = useState('');
  const [layoutProfileWidth, setLayoutProfileWidth] = useState('');
  const [layoutDirection, setLayoutDirection] = useState('width');
  const [layoutAngle, setLayoutAngle] = useState('0');
  const [layoutResult, setLayoutResult] = useState<{ profiles: string; waste: string } | null>(null);

  // Custom calculator state
  const [customA, setCustomA] = useState('');
  const [customB, setCustomB] = useState('');
  const [customOperation, setCustomOperation] = useState<'multiply' | 'divide' | 'add' | 'subtract'>('multiply');
  const [customResult, setCustomResult] = useState<string | null>(null);

  const tabs = [
    { id: 'area' as CalculatorTab, label: 'Площадь', icon: Square },
    { id: 'volume' as CalculatorTab, label: 'Объём', icon: Box },
    { id: 'material' as CalculatorTab, label: 'Материал', icon: Layers },
    { id: 'layout' as CalculatorTab, label: 'Укладка', icon: Grid3X3 },
    { id: 'custom' as CalculatorTab, label: 'Формулы', icon: Calculator },
  ];

  const calculateArea = () => {
    const l = parseFloat(areaLength);
    const w = parseFloat(areaWidth);
    if (!isNaN(l) && !isNaN(w)) {
      setAreaResult((l * w).toFixed(2));
    }
  };

  const calculateVolume = () => {
    const l = parseFloat(volumeLength);
    const w = parseFloat(volumeWidth);
    const h = parseFloat(volumeHeight);
    if (!isNaN(l) && !isNaN(w) && !isNaN(h)) {
      setVolumeResult((l * w * h).toFixed(3));
    }
  };

  const calculateMaterial = () => {
    const area = parseFloat(materialArea);
    const size = parseFloat(materialSize);
    const gap = parseFloat(materialGap) || 0;
    const reserve = parseFloat(materialReserve) || 0;
    if (!isNaN(area) && !isNaN(size) && size > 0) {
      const effectiveSize = size + gap;
      const count = Math.ceil((area / effectiveSize) * (1 + reserve / 100));
      setMaterialResult(count.toString());
    }
  };

  const calculateLayout = () => {
    const roomSize = parseFloat(layoutRoomSize);
    const profileLength = parseFloat(layoutProfileLength);
    const profileWidth = parseFloat(layoutProfileWidth);
    const angle = parseFloat(layoutAngle) || 0;
    
    if (!isNaN(roomSize) && !isNaN(profileLength) && !isNaN(profileWidth) && profileLength > 0 && profileWidth > 0) {
      let effectiveRoomSize = roomSize;
      
      // Adjust for angle (simplified calculation)
      if (angle > 0 && angle < 90) {
        const radians = (angle * Math.PI) / 180;
        effectiveRoomSize = roomSize / Math.cos(radians);
      }
      
      const profilesNeeded = Math.ceil(effectiveRoomSize / (profileWidth / 1000));
      const totalProfileLength = profilesNeeded * (layoutDirection === 'width' ? roomSize : effectiveRoomSize);
      const fullProfiles = Math.ceil(totalProfileLength / profileLength);
      const wastePercent = ((fullProfiles * profileLength - totalProfileLength) / (fullProfiles * profileLength) * 100).toFixed(1);
      
      setLayoutResult({
        profiles: fullProfiles.toString(),
        waste: wastePercent
      });
    }
  };

  const calculateCustom = () => {
    const a = parseFloat(customA);
    const b = parseFloat(customB);
    if (!isNaN(a) && !isNaN(b)) {
      let result: number;
      switch (customOperation) {
        case 'multiply':
          result = a * b;
          break;
        case 'divide':
          result = b !== 0 ? a / b : 0;
          break;
        case 'add':
          result = a + b;
          break;
        case 'subtract':
          result = a - b;
          break;
      }
      setCustomResult(result.toFixed(3));
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Скопировано в буфер обмена');
  };

  const handleAddToProject = (name: string, value: string, unit: string) => {
    setPendingMaterial({ name, value, unit });
    setShowProjectModal(true);
  };

  const confirmAddToProject = (projectId: number) => {
    if (pendingMaterial) {
      const material: Material = {
        id: Date.now() + Math.random(),
        name: pendingMaterial.name,
        quantity: pendingMaterial.value,
        unit: pendingMaterial.unit,
        category: 'Другое',
        notes: 'Добавлено из калькулятора',
      };
      onAddMaterialToProject(projectId, material);
      toast.success('Материал добавлен в проект');
      setShowProjectModal(false);
      setPendingMaterial(null);
    }
  };

  const resetCalculator = (tab: CalculatorTab) => {
    switch (tab) {
      case 'area':
        setAreaLength('');
        setAreaWidth('');
        setAreaResult(null);
        break;
      case 'volume':
        setVolumeLength('');
        setVolumeWidth('');
        setVolumeHeight('');
        setVolumeResult(null);
        break;
      case 'material':
        setMaterialArea('');
        setMaterialSize('');
        setMaterialGap('0');
        setMaterialReserve('10');
        setMaterialResult(null);
        break;
      case 'layout':
        setLayoutRoomSize('');
        setLayoutProfileLength('');
        setLayoutProfileWidth('');
        setLayoutDirection('width');
        setLayoutAngle('0');
        setLayoutResult(null);
        break;
      case 'custom':
        setCustomA('');
        setCustomB('');
        setCustomResult(null);
        break;
    }
  };

  const ResultActions: React.FC<{ name: string; value: string; unit: string }> = ({ name, value, unit }) => (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => copyToClipboard(value)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
      >
        <Copy size={16} />
        Копировать
      </button>
      <button
        onClick={() => handleAddToProject(name, value, unit)}
        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus size={16} />
        В проект
      </button>
    </div>
  );

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Calculator className="text-primary" />
          Калькулятор материалов
        </h2>
        <p className="text-muted-foreground mt-1">Расчёт площадей, объёмов и количества материалов</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Calculator Content */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        {/* Area Calculator */}
        {activeTab === 'area' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Расчёт площади (м²)</h3>
              <button
                onClick={() => resetCalculator('area')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Длина (м)</label>
                <input
                  type="number"
                  value={areaLength}
                  onChange={(e) => setAreaLength(e.target.value)}
                  className="input-field"
                  placeholder="Введите длину"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ширина (м)</label>
                <input
                  type="number"
                  value={areaWidth}
                  onChange={(e) => setAreaWidth(e.target.value)}
                  className="input-field"
                  placeholder="Введите ширину"
                  step="0.01"
                />
              </div>
            </div>

            <button
              onClick={calculateArea}
              disabled={!areaLength || !areaWidth}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={18} />
              Рассчитать
            </button>

            {areaResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Результат:</div>
                <div className="text-2xl font-bold text-foreground">{areaResult} м²</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {areaLength} × {areaWidth} = {areaResult}
                </div>
                <ResultActions name={`Площадь ${areaLength}×${areaWidth}м`} value={areaResult} unit="м²" />
              </div>
            )}
          </div>
        )}

        {/* Volume Calculator */}
        {activeTab === 'volume' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Расчёт объёма (м³)</h3>
              <button
                onClick={() => resetCalculator('volume')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Длина (м)</label>
                <input
                  type="number"
                  value={volumeLength}
                  onChange={(e) => setVolumeLength(e.target.value)}
                  className="input-field"
                  placeholder="Длина"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ширина (м)</label>
                <input
                  type="number"
                  value={volumeWidth}
                  onChange={(e) => setVolumeWidth(e.target.value)}
                  className="input-field"
                  placeholder="Ширина"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Высота (м)</label>
                <input
                  type="number"
                  value={volumeHeight}
                  onChange={(e) => setVolumeHeight(e.target.value)}
                  className="input-field"
                  placeholder="Высота"
                  step="0.01"
                />
              </div>
            </div>

            <button
              onClick={calculateVolume}
              disabled={!volumeLength || !volumeWidth || !volumeHeight}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={18} />
              Рассчитать
            </button>

            {volumeResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Результат:</div>
                <div className="text-2xl font-bold text-foreground">{volumeResult} м³</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {volumeLength} × {volumeWidth} × {volumeHeight} = {volumeResult}
                </div>
                <ResultActions name={`Объём ${volumeLength}×${volumeWidth}×${volumeHeight}м`} value={volumeResult} unit="м³" />
              </div>
            )}
          </div>
        )}

        {/* Material Calculator */}
        {activeTab === 'material' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Расчёт количества материала</h3>
              <button
                onClick={() => resetCalculator('material')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Площадь покрытия (м²)</label>
                <input
                  type="number"
                  value={materialArea}
                  onChange={(e) => setMaterialArea(e.target.value)}
                  className="input-field"
                  placeholder="Общая площадь"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Размер единицы материала (м²)</label>
                <input
                  type="number"
                  value={materialSize}
                  onChange={(e) => setMaterialSize(e.target.value)}
                  className="input-field"
                  placeholder="Площадь одной единицы"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Зазор между элементами (м²)</label>
                <input
                  type="number"
                  value={materialGap}
                  onChange={(e) => setMaterialGap(e.target.value)}
                  className="input-field"
                  placeholder="0"
                  step="0.001"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Запас (%)</label>
                <input
                  type="number"
                  value={materialReserve}
                  onChange={(e) => setMaterialReserve(e.target.value)}
                  className="input-field"
                  placeholder="10"
                  step="1"
                />
              </div>
            </div>

            <button
              onClick={calculateMaterial}
              disabled={!materialArea || !materialSize}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={18} />
              Рассчитать
            </button>

            {materialResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Необходимо единиц материала:</div>
                <div className="text-2xl font-bold text-foreground">{materialResult} шт</div>
                <div className="text-xs text-muted-foreground mt-1">
                  С учётом запаса {materialReserve}%
                </div>
                <ResultActions name="Материал (расчёт)" value={materialResult} unit="шт" />
              </div>
            )}
          </div>
        )}

        {/* Layout Calculator */}
        {activeTab === 'layout' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Расчёт укладки профиля</h3>
              <button
                onClick={() => resetCalculator('layout')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Размер помещения (м)</label>
                <input
                  type="number"
                  value={layoutRoomSize}
                  onChange={(e) => setLayoutRoomSize(e.target.value)}
                  className="input-field"
                  placeholder="Длина или ширина комнаты"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Длина профиля (м)</label>
                <input
                  type="number"
                  value={layoutProfileLength}
                  onChange={(e) => setLayoutProfileLength(e.target.value)}
                  className="input-field"
                  placeholder="Стандартная длина профиля"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Ширина профиля (мм)</label>
                <input
                  type="number"
                  value={layoutProfileWidth}
                  onChange={(e) => setLayoutProfileWidth(e.target.value)}
                  className="input-field"
                  placeholder="Ширина в миллиметрах"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Направление укладки</label>
                <select
                  value={layoutDirection}
                  onChange={(e) => setLayoutDirection(e.target.value)}
                  className="input-field"
                >
                  {LAYOUT_DIRECTIONS.map((dir) => (
                    <option key={dir.value} value={dir.value}>
                      {dir.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Угол укладки (градусы)</label>
                <input
                  type="number"
                  value={layoutAngle}
                  onChange={(e) => setLayoutAngle(e.target.value)}
                  className="input-field"
                  placeholder="0 - прямая укладка"
                  step="1"
                  min="0"
                  max="89"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  0° - прямая укладка, увеличение угла добавляет расход материала
                </p>
              </div>
            </div>

            <button
              onClick={calculateLayout}
              disabled={!layoutRoomSize || !layoutProfileLength || !layoutProfileWidth}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={18} />
              Рассчитать
            </button>

            {layoutResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Профилей нужно:</div>
                    <div className="text-2xl font-bold text-foreground">{layoutResult.profiles} шт</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Отходы:</div>
                    <div className="text-2xl font-bold text-foreground">{layoutResult.waste}%</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Направление: {LAYOUT_DIRECTIONS.find(d => d.value === layoutDirection)?.label}, угол: {layoutAngle}°
                </div>
                <ResultActions name={`Профиль ${layoutProfileLength}м`} value={layoutResult.profiles} unit="шт" />
              </div>
            )}
          </div>
        )}

        {/* Custom Calculator */}
        {activeTab === 'custom' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Универсальный калькулятор</h3>
              <button
                onClick={() => resetCalculator('custom')}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <RotateCcw size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Значение A</label>
                <input
                  type="number"
                  value={customA}
                  onChange={(e) => setCustomA(e.target.value)}
                  className="input-field"
                  placeholder="Первое число"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Операция</label>
                <select
                  value={customOperation}
                  onChange={(e) => setCustomOperation(e.target.value as typeof customOperation)}
                  className="input-field"
                >
                  <option value="multiply">A × B (умножение)</option>
                  <option value="divide">A ÷ B (деление)</option>
                  <option value="add">A + B (сложение)</option>
                  <option value="subtract">A − B (вычитание)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Значение B</label>
                <input
                  type="number"
                  value={customB}
                  onChange={(e) => setCustomB(e.target.value)}
                  className="input-field"
                  placeholder="Второе число"
                  step="any"
                />
              </div>
            </div>

            <button
              onClick={calculateCustom}
              disabled={!customA || !customB}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator size={18} />
              Рассчитать
            </button>

            {customResult && (
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-1">Результат:</div>
                <div className="text-2xl font-bold text-foreground">{customResult}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {customA} {customOperation === 'multiply' ? '×' : customOperation === 'divide' ? '÷' : customOperation === 'add' ? '+' : '−'} {customB} = {customResult}
                </div>
                <ResultActions name="Расчёт" value={customResult} unit="шт" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Project Selection Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setPendingMaterial(null);
        }}
        title="Выберите проект"
      >
        <div className="space-y-3">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              Нет доступных проектов. Сначала создайте проект.
            </p>
          ) : (
            projects.map((project) => (
              <button
                key={project.id}
                onClick={() => confirmAddToProject(project.id)}
                className="w-full flex items-center justify-between p-4 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-foreground">{project.name}</div>
                  {project.location && (
                    <div className="text-sm text-muted-foreground">{project.location}</div>
                  )}
                </div>
                <ArrowRight size={18} className="text-muted-foreground" />
              </button>
            ))
          )}
        </div>
      </Modal>
    </main>
  );
};
