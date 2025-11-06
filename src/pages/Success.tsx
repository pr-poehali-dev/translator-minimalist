import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('isPremium', 'true');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full animate-scale-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Icon name="Check" size={48} className="text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Оплата успешна! 🎉
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Добро пожаловать в Premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="Crown" size={20} className="text-primary" />
              <span className="font-semibold">Безлимитные переводы активированы</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">Чек отправлен на вашу почту</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Calendar" size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">Подписка действует 30 дней</span>
            </div>
          </div>

          <Button 
            onClick={() => navigate('/')} 
            className="w-full bg-gradient-to-r from-primary to-secondary"
            size="lg"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Начать пользоваться
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
