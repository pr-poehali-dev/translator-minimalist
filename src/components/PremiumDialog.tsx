import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface PremiumDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpgrade: () => void;
}

const PremiumDialog = ({ open, onOpenChange, onUpgrade }: PremiumDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Укажите email",
        description: "Email необходим для отправки чека",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const userId = localStorage.getItem('user_id') || `user_${Date.now()}`;
      localStorage.setItem('user_id', userId);

      const response = await fetch('https://functions.poehali.dev/5bddec24-21a4-433a-9eb4-fecc6e54d136', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          email: email,
          return_url: window.location.origin + '/success'
        })
      });

      const data = await response.json();

      if (response.ok && data.confirmation_url) {
        window.location.href = data.confirmation_url;
      } else {
        toast({
          title: "Ошибка",
          description: data.error || "Не удалось создать платеж",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Проблема с подключением к серверу",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Выберите ваш тариф
          </DialogTitle>
          <DialogDescription className="text-center text-lg">
            Получите неограниченный доступ ко всем переводчикам
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="border-2">
            <CardHeader>
              <Badge className="w-fit mb-2" variant="secondary">Бесплатно</Badge>
              <CardTitle className="text-2xl">Базовый</CardTitle>
              <CardDescription>Для знакомства с сервисом</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">0₽</span>
                <span className="text-muted-foreground">/навсегда</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>10 переводов в день</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>Все 3 переводчика</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="X" size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">История переводов</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="X" size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Приоритетная поддержка</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="X" size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">Без рекламы</span>
              </div>
              <Button variant="outline" className="w-full mt-4" disabled>
                Текущий тариф
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary shadow-lg relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1">
                Популярный
              </Badge>
            </div>
            <CardHeader>
              <Badge className="w-fit mb-2 bg-primary">Premium</Badge>
              <CardTitle className="text-2xl">Премиум</CardTitle>
              <CardDescription>Для активных пользователей</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">199₽</span>
                <span className="text-muted-foreground">/месяц</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span className="font-semibold">Безлимитные переводы</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>Все 3 переводчика</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>История переводов</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>Приоритетная поддержка</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Check" size={20} className="text-green-600" />
                <span>Без рекламы</span>
              </div>
              <div className="space-y-3 mt-4">
                <Input
                  type="email"
                  placeholder="Ваш email для чека"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                  size="lg"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Icon name="Loader2" size={20} className="mr-2 animate-spin" />
                      Подготовка...
                    </>
                  ) : (
                    <>
                      <Icon name="Crown" size={20} className="mr-2" />
                      Оплатить 199₽
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Безопасная оплата через ЮKassa
          </p>
          <div className="flex justify-center gap-4 items-center opacity-60">
            <Icon name="CreditCard" size={24} />
            <Icon name="Wallet" size={24} />
            <Icon name="Smartphone" size={24} />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            После оплаты вы получите чек на указанный email
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumDialog;