import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import PremiumDialog from '@/components/PremiumDialog';

const Index = () => {
  const { toast } = useToast();
  const [genderInput, setGenderInput] = useState('');
  const [genderOutput, setGenderOutput] = useState('');
  const [genderDirection, setGenderDirection] = useState('female-to-male');
  const [ageGroup, setAgeGroup] = useState('16-35');

  const [animalInput, setAnimalInput] = useState('');
  const [animalOutput, setAnimalOutput] = useState('');
  const [animalType, setAnimalType] = useState('cat');

  const [generationInput, setGenerationInput] = useState('');
  const [generationOutput, setGenerationOutput] = useState('');
  const [generationDirection, setGenerationDirection] = useState('zoomer-to-boomer');

  const [isPremium, setIsPremium] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const FREE_LIMIT = 10;

  useEffect(() => {
    const savedUsage = localStorage.getItem('translatorUsage');
    const savedDate = localStorage.getItem('translatorDate');
    const savedPremium = localStorage.getItem('isPremium');
    const today = new Date().toDateString();

    if (savedPremium === 'true') {
      setIsPremium(true);
    }

    if (savedDate !== today) {
      localStorage.setItem('translatorUsage', '0');
      localStorage.setItem('translatorDate', today);
      setUsageCount(0);
    } else if (savedUsage) {
      setUsageCount(parseInt(savedUsage));
    }
  }, []);

  const incrementUsage = () => {
    if (isPremium) return true;
    
    if (usageCount >= FREE_LIMIT) {
      setShowPremiumDialog(true);
      toast({
        title: "Лимит исчерпан",
        description: "Вы достигли лимита бесплатных переводов на сегодня. Перейдите на Premium!",
        variant: "destructive"
      });
      return false;
    }

    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('translatorUsage', newCount.toString());

    if (newCount === FREE_LIMIT) {
      toast({
        title: "Последний бесплатный перевод",
        description: "Вы использовали все бесплатные переводы на сегодня.",
        variant: "default"
      });
    }

    return true;
  };

  const handleUpgrade = () => {
    setIsPremium(true);
    localStorage.setItem('isPremium', 'true');
    setShowPremiumDialog(false);
    toast({
      title: "Добро пожаловать в Premium! 🎉",
      description: "Теперь у вас безлимитный доступ ко всем переводчикам."
    });
  };

  const translateGender = () => {
    if (!genderInput.trim()) return;
    if (!incrementUsage()) return;
    
    const translations: Record<string, Record<string, string>> = {
      'female-to-male': {
        '0-16': `Слушай, бро, ${genderInput.toLowerCase().replace(/давай/g, 'погнали').replace(/!/g, '!')}`,
        '16-35': `Чувак, ${genderInput.toLowerCase().replace(/мне кажется/g, 'по-моему').replace(/очень/g, 'реально')}`,
        '35+': `Коллега, ${genderInput.toLowerCase().replace(/классно/g, 'отлично').replace(/круто/g, 'замечательно')}`
      },
      'male-to-female': {
        '0-16': `Подружка, ${genderInput.toLowerCase().replace(/бро/g, 'солнышко').replace(/чувак/g, 'милая')}`,
        '16-35': `Слушай, ${genderInput.toLowerCase().replace(/погнали/g, 'давай').replace(/реально/g, 'очень')}`,
        '35+': `Дорогая, ${genderInput.toLowerCase().replace(/отлично/g, 'прекрасно').replace(/замечательно/g, 'чудесно')}`
      }
    };

    setGenderOutput(translations[genderDirection][ageGroup] || `Переведено (${ageGroup}): ${genderInput}`);
  };

  const translateAnimal = () => {
    if (!animalInput.trim()) return;
    if (!incrementUsage()) return;
    
    const translations: Record<string, string> = {
      'cat': `😸 Мяу-мяу! (Перевод: "${animalInput}" - это значит, что кот хочет внимания и, возможно, еды)`,
      'dog': `🐕 Гав-гав! (Перевод: "${animalInput}" - собака очень рада вас видеть и готова к игре!)`,
      'parrot': `🦜 Попка дурак! (Перевод: "${animalInput}" - попугай пытается с вами общаться и просит угощение)`,
      'fish': `🐠 Буль-буль... (Перевод: "${animalInput}" - рыбка спокойна, но хочет, чтобы вы её покормили)`,
      'hamster': `🐹 Пи-пи-пи! (Перевод: "${animalInput}" - хомячок активен и хочет поиграть в колесе)`,
      'rabbit': `🐰 Тыц-тыц! (Перевод: "${animalInput}" - кролик доволен и просит погладить его ушки)`
    };

    setAnimalOutput(translations[animalType] || `Перевод с ${animalType}: ${animalInput}`);
  };

  const translateGeneration = () => {
    if (!generationInput.trim()) return;
    if (!incrementUsage()) return;
    
    const translations: Record<string, string> = {
      'zoomer-to-boomer': `В нормальном переводе: ${generationInput.toLowerCase()
        .replace(/краш/g, 'симпатия')
        .replace(/флексить/g, 'хвастаться')
        .replace(/кринж/g, 'неловкая ситуация')
        .replace(/рофл/g, 'смешно')
        .replace(/вайб/g, 'атмосфера')
        .replace(/чилить/g, 'отдыхать')}`,
      'zoomer-to-millennial': `По-миллениалски: ${generationInput.toLowerCase()
        .replace(/краш/g, 'любовь')
        .replace(/флексить/g, 'показывать себя')
        .replace(/кринж/g, 'стыдоба')
        .replace(/рофл/g, 'лол')
        .replace(/вайб/g, 'настроение')
        .replace(/чилить/g, 'тусить')}`,
      'boomer-to-zoomer': `На зумерском: ${generationInput.toLowerCase()
        .replace(/симпатия/g, 'краш')
        .replace(/хвастаться/g, 'флексить')
        .replace(/неловко/g, 'кринж')
        .replace(/смешно/g, 'рофл')
        .replace(/атмосфера/g, 'вайб')
        .replace(/отдыхать/g, 'чилить')}`,
      'millennial-to-zoomer': `На зумерском: ${generationInput.toLowerCase()
        .replace(/лол/g, 'рофл')
        .replace(/эпик/g, 'огонь')
        .replace(/круто/g, 'топ')
        .replace(/стыдоба/g, 'кринж')
        .replace(/тусить/g, 'чилить')}`
    };

    setGenerationOutput(translations[generationDirection] || `Переведено: ${generationInput}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/20">
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Универсальный Переводчик
            </h1>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white">
                <Icon name="Crown" size={16} className="mr-1" />
                Premium
              </Badge>
            )}
          </div>
          <p className="text-xl text-muted-foreground">
            Три уникальных переводчика в одном месте
          </p>
        </div>

        {!isPremium && (
          <Card className="mb-8 border-primary/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-medium">Переводов использовано сегодня</p>
                  <p className="text-2xl font-bold">{usageCount} / {FREE_LIMIT}</p>
                </div>
                <Button
                  variant="default"
                  onClick={() => setShowPremiumDialog(true)}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Icon name="Crown" size={18} className="mr-2" />
                  Перейти на Premium
                </Button>
              </div>
              <Progress value={(usageCount / FREE_LIMIT) * 100} className="h-2" />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="gender" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gender" className="flex items-center gap-2">
              <Icon name="Users" size={18} />
              Гендерный
            </TabsTrigger>
            <TabsTrigger value="animal" className="flex items-center gap-2">
              <Icon name="Cat" size={18} />
              Животные
            </TabsTrigger>
            <TabsTrigger value="generation" className="flex items-center gap-2">
              <Icon name="MessageCircle" size={18} />
              Поколения
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gender" className="animate-scale-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="ArrowLeftRight" size={24} />
                  Гендерный переводчик
                </CardTitle>
                <CardDescription>
                  Переводите фразы с женского на мужской язык и обратно, учитывая возраст
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Направление перевода</label>
                    <Select value={genderDirection} onValueChange={setGenderDirection}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female-to-male">
                          <span className="flex items-center gap-2">
                            Женский → Мужской
                          </span>
                        </SelectItem>
                        <SelectItem value="male-to-female">
                          <span className="flex items-center gap-2">
                            Мужской → Женский
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Возрастная группа</label>
                    <Select value={ageGroup} onValueChange={setAgeGroup}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-16">0-16 лет</SelectItem>
                        <SelectItem value="16-35">16-35 лет</SelectItem>
                        <SelectItem value="35+">35+ лет</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Исходный текст</label>
                  <Textarea
                    placeholder="Введите текст для перевода..."
                    value={genderInput}
                    onChange={(e) => setGenderInput(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button onClick={translateGender} className="w-full" size="lg">
                  <Icon name="Languages" size={20} className="mr-2" />
                  Перевести
                </Button>

                {genderOutput && (
                  <div className="animate-fade-in">
                    <label className="text-sm font-medium mb-2 block">Перевод</label>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-foreground">{genderOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animal" className="animate-scale-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Smile" size={24} />
                  Переводчик с языка животных
                </CardTitle>
                <CardDescription>
                  Узнайте, что хочет сказать ваш питомец
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Выберите животное</label>
                  <Select value={animalType} onValueChange={setAnimalType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cat">🐱 Кошка</SelectItem>
                      <SelectItem value="dog">🐕 Собака</SelectItem>
                      <SelectItem value="parrot">🦜 Попугай</SelectItem>
                      <SelectItem value="fish">🐠 Рыбка</SelectItem>
                      <SelectItem value="hamster">🐹 Хомяк</SelectItem>
                      <SelectItem value="rabbit">🐰 Кролик</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Что говорит питомец?</label>
                  <Textarea
                    placeholder="Опишите поведение или звуки питомца..."
                    value={animalInput}
                    onChange={(e) => setAnimalInput(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button onClick={translateAnimal} className="w-full" size="lg">
                  <Icon name="Sparkles" size={20} className="mr-2" />
                  Перевести
                </Button>

                {animalOutput && (
                  <div className="animate-fade-in">
                    <label className="text-sm font-medium mb-2 block">Перевод</label>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-foreground">{animalOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generation" className="animate-scale-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Wifi" size={24} />
                  Межпоколенческий переводчик
                </CardTitle>
                <CardDescription>
                  Переводите между зумерским, миллениальским и бумерским языком
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Направление перевода</label>
                  <Select value={generationDirection} onValueChange={setGenerationDirection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoomer-to-boomer">Зумер → Бумер</SelectItem>
                      <SelectItem value="zoomer-to-millennial">Зумер → Миллениал</SelectItem>
                      <SelectItem value="boomer-to-zoomer">Бумер → Зумер</SelectItem>
                      <SelectItem value="millennial-to-zoomer">Миллениал → Зумер</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Исходный текст</label>
                  <Textarea
                    placeholder="Введите текст для перевода..."
                    value={generationInput}
                    onChange={(e) => setGenerationInput(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                <Button onClick={translateGeneration} className="w-full" size="lg">
                  <Icon name="Zap" size={20} className="mr-2" />
                  Перевести
                </Button>

                {generationOutput && (
                  <div className="animate-fade-in">
                    <label className="text-sm font-medium mb-2 block">Перевод</label>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="text-foreground">{generationOutput}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center animate-fade-in">
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="text-center">
                  <Icon name="Shield" size={48} className="mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Точный перевод</h3>
                  <p className="text-sm text-muted-foreground">Учитываем контекст и особенности</p>
                </div>
                <div className="text-center">
                  <Icon name="Zap" size={48} className="mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Быстро</h3>
                  <p className="text-sm text-muted-foreground">Мгновенный результат</p>
                </div>
                <div className="text-center">
                  <Icon name="Heart" size={48} className="mx-auto mb-2 text-primary" />
                  <h3 className="font-semibold mb-1">Бесплатно</h3>
                  <p className="text-sm text-muted-foreground">Без ограничений</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PremiumDialog
        open={showPremiumDialog}
        onOpenChange={setShowPremiumDialog}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default Index;