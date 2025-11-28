import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

type Page = 'home' | 'scripts' | 'profile' | 'forum' | 'community';

interface Script {
  id: number;
  title: string;
  author: string;
  category: string;
  likes: number;
  downloads: number;
  code: string;
}

interface ForumTopic {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  status: 'open' | 'closed';
}

const Index = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const scripts: Script[] = [
    {
      id: 1,
      title: 'Auto Farm Script',
      author: 'ProCoder123',
      category: 'Farming',
      likes: 1247,
      downloads: 5632,
      code: 'local player = game.Players.LocalPlayer\nprint("Auto Farm Active!")'
    },
    {
      id: 2,
      title: 'Speed Hack Ultimate',
      author: 'SpeedDemon',
      category: 'Movement',
      likes: 892,
      downloads: 3421,
      code: 'game.Players.LocalPlayer.Character.Humanoid.WalkSpeed = 100'
    },
    {
      id: 3,
      title: 'ESP Wallhack',
      author: 'VisionMaster',
      category: 'Visual',
      likes: 2103,
      downloads: 8945,
      code: '-- ESP Code Here\nlocal esp = true'
    },
    {
      id: 4,
      title: 'Infinite Jump',
      author: 'JumpKing',
      category: 'Movement',
      likes: 654,
      downloads: 2187,
      code: 'UserInputService.JumpRequest:connect(function()\n  game.Players.LocalPlayer.Character:FindFirstChildOfClass("Humanoid"):ChangeState("Jumping")\nend)'
    }
  ];

  const forumTopics: ForumTopic[] = [
    { id: 1, title: 'Лучшие скрипты для новичков', author: 'AdminUser', replies: 45, views: 1203, status: 'open' },
    { id: 2, title: 'Обновление безопасности', author: 'ModTeam', replies: 12, views: 567, status: 'closed' },
    { id: 3, title: 'Как создать свой первый скрипт?', author: 'Helper123', replies: 78, views: 2341, status: 'open' },
    { id: 4, title: 'Баг-репорт: проблема с загрузкой', author: 'User456', replies: 23, views: 456, status: 'open' }
  ];

  const userStats = {
    timeSpent: '127 часов 34 минуты',
    scriptsUploaded: 12,
    totalDownloads: 8432,
    reputation: 1547,
    rank: 'Veteran Scripter'
  };

  const renderNavigation = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center glow-blue">
              <Icon name="Code2" size={24} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              RoScript Hub
            </h1>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('home')}
              className="gap-2"
            >
              <Icon name="Home" size={18} />
              Главная
            </Button>
            <Button
              variant={currentPage === 'scripts' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('scripts')}
              className="gap-2"
            >
              <Icon name="FileCode" size={18} />
              Скрипты
            </Button>
            <Button
              variant={currentPage === 'forum' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('forum')}
              className="gap-2"
            >
              <Icon name="MessageSquare" size={18} />
              Форум
            </Button>
            <Button
              variant={currentPage === 'community' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('community')}
              className="gap-2"
            >
              <Icon name="Users" size={18} />
              Сообщество
            </Button>
            <Button
              variant={currentPage === 'profile' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('profile')}
              className="gap-2"
            >
              <Icon name="User" size={18} />
              Профиль
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost">
              <Icon name="Bell" size={20} />
            </Button>
            <Avatar className="border-2 border-primary glow-blue">
              <AvatarFallback>PC</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div className="space-y-8">
      <div className="relative h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 border border-primary/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
          <h2 className="text-4xl font-bold mb-4">Добро пожаловать в RoScript Hub</h2>
          <p className="text-xl text-muted-foreground mb-6">Крупнейшая платформа Lua скриптов для Roblox</p>
          <div className="flex gap-4">
            <Button size="lg" className="glow-blue" onClick={() => setCurrentPage('scripts')}>
              <Icon name="Download" size={20} className="mr-2" />
              Скачать скрипты
            </Button>
            <Button size="lg" variant="secondary" className="glow-purple">
              <Icon name="Upload" size={20} className="mr-2" />
              Загрузить свой
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/30 hover:border-primary transition-all hover:glow-blue">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
              <Icon name="TrendingUp" size={24} className="text-primary" />
            </div>
            <CardTitle>Популярные скрипты</CardTitle>
            <CardDescription>Топ загрузок недели</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{scripts.length}+</div>
            <p className="text-sm text-muted-foreground">активных скриптов</p>
          </CardContent>
        </Card>

        <Card className="border-secondary/30 hover:border-secondary transition-all hover:glow-purple">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
              <Icon name="Users" size={24} className="text-secondary" />
            </div>
            <CardTitle>Активное сообщество</CardTitle>
            <CardDescription>Присоединяйся к нам</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">12,547</div>
            <p className="text-sm text-muted-foreground">участников онлайн</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/30 hover:border-destructive transition-all">
          <CardHeader>
            <div className="w-12 h-12 rounded-lg bg-destructive/20 flex items-center justify-center mb-4">
              <Icon name="Zap" size={24} className="text-destructive" />
            </div>
            <CardTitle>Быстрая поддержка</CardTitle>
            <CardDescription>Помощь 24/7</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">&lt;5 мин</div>
            <p className="text-sm text-muted-foreground">время ответа</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Flame" size={24} className="text-destructive" />
            Горячие скрипты дня
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.slice(0, 2).map(script => (
              <Card key={script.id} className="border-border hover:border-primary transition-all cursor-pointer" onClick={() => {
                setCurrentPage('scripts');
              }}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{script.title}</CardTitle>
                      <CardDescription>by {script.author}</CardDescription>
                    </div>
                    <Badge variant="secondary">{script.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={16} />
                      {script.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Download" size={16} />
                      {script.downloads}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderScripts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Библиотека скриптов</h2>
          <p className="text-muted-foreground">Найди и загрузи лучшие Lua скрипты для Roblox</p>
        </div>
        <Button className="glow-blue">
          <Icon name="Plus" size={20} className="mr-2" />
          Добавить скрипт
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="farming">Farming</TabsTrigger>
          <TabsTrigger value="movement">Movement</TabsTrigger>
          <TabsTrigger value="visual">Visual</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4 mt-6">
          {scripts.map(script => (
            <Card key={script.id} className="border-border hover:border-primary transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{script.title}</CardTitle>
                      <Badge variant="outline" className="border-primary text-primary">{script.category}</Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarFallback className="text-xs">{script.author[0]}</AvatarFallback>
                      </Avatar>
                      {script.author}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Icon name="Heart" size={20} />
                    </Button>
                    <Button className="glow-blue">
                      <Icon name="Download" size={16} className="mr-2" />
                      Скачать
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-4 font-mono text-sm">
                  <code>{script.code}</code>
                </div>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Icon name="Heart" size={16} className="text-destructive" />
                    {script.likes} лайков
                  </span>
                  <span className="flex items-center gap-2">
                    <Icon name="Download" size={16} className="text-primary" />
                    {script.downloads} загрузок
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Card className="border-primary/30 glow-blue">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary">
              <AvatarFallback className="text-2xl">PC</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-3xl mb-2">ProCoder123</CardTitle>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-secondary">{userStats.rank}</Badge>
                <Badge variant="outline" className="border-primary">
                  <Icon name="Star" size={14} className="mr-1" />
                  {userStats.reputation} репутации
                </Badge>
              </div>
              <CardDescription>Скриптер с 2022 года • Lua энтузиаст</CardDescription>
            </div>
            <Button variant="outline">Редактировать профиль</Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Время на сайте</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <Icon name="Clock" size={24} />
              <span className="text-sm">{userStats.timeSpent}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Загружено скриптов</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary flex items-center gap-2">
              <Icon name="FileCode" size={24} />
              {userStats.scriptsUploaded}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Всего загрузок</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive flex items-center gap-2">
              <Icon name="Download" size={24} />
              {userStats.totalDownloads}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Репутация</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
              <Icon name="Award" size={24} />
              {userStats.reputation}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Мои скрипты</CardTitle>
          <CardDescription>Список опубликованных скриптов</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scripts.slice(0, 3).map(script => (
              <div key={script.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary transition-all">
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">{script.title}</h4>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Heart" size={14} />
                      {script.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="Download" size={14} />
                      {script.downloads}
                    </span>
                  </div>
                </div>
                <Badge>{script.category}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderForum = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Форум сообщества</h2>
          <p className="text-muted-foreground">Обсуждай скрипты и делись опытом</p>
        </div>
        <Button className="glow-purple">
          <Icon name="Plus" size={20} className="mr-2" />
          Создать тему
        </Button>
      </div>

      <div className="space-y-3">
        {forumTopics.map(topic => (
          <Card key={topic.id} className="border-border hover:border-primary transition-all cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                    <Badge variant={topic.status === 'open' ? 'default' : 'secondary'}>
                      {topic.status === 'open' ? (
                        <><Icon name="Unlock" size={14} className="mr-1" />Открыта</>
                      ) : (
                        <><Icon name="Lock" size={14} className="mr-1" />Закрыта</>
                      )}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Avatar className="w-5 h-5">
                      <AvatarFallback className="text-xs">{topic.author[0]}</AvatarFallback>
                    </Avatar>
                    {topic.author}
                  </CardDescription>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Icon name="MessageSquare" size={16} />
                    {topic.replies}
                  </span>
                  <span className="flex items-center gap-2">
                    <Icon name="Eye" size={16} />
                    {topic.views}
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCommunity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Сообщество</h2>
        <p className="text-muted-foreground">Активные участники и топ скриптеров</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trophy" size={24} className="text-yellow-500" />
              Топ скриптеров месяца
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {['ProCoder123', 'SpeedDemon', 'VisionMaster', 'JumpKing', 'MasterHacker'].map((name, idx) => (
                  <div key={name} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary transition-all">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <Avatar>
                      <AvatarFallback>{name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{name}</p>
                      <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 5000 + 1000)} репутации</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Activity" size={24} className="text-primary" />
              Последняя активность
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4">
                {[
                  { user: 'ProCoder123', action: 'загрузил новый скрипт', time: '5 мин назад' },
                  { user: 'SpeedDemon', action: 'оставил комментарий', time: '12 мин назад' },
                  { user: 'VisionMaster', action: 'обновил профиль', time: '23 мин назад' },
                  { user: 'JumpKing', action: 'создал тему на форуме', time: '1 час назад' }
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{activity.user[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {renderNavigation()}
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'scripts' && renderScripts()}
        {currentPage === 'profile' && renderProfile()}
        {currentPage === 'forum' && renderForum()}
        {currentPage === 'community' && renderCommunity()}
      </main>
    </div>
  );
};

export default Index;