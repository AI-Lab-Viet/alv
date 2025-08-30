import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle,
  Circle,
  Lock,
  BookOpen,
  Trophy,
  MapPin,
  Compass,
  Lightbulb,
  Crown
} from 'lucide-react';
import Link from 'next/link';

const userProgress = {
  completedStations: 1,
  totalStations: 6,
  currentStation: 2,
  userName: 'LMQ'
};

const journeyStations = [
  // World 3: Pinnacle of Creation
  {
    id: 6,
    world: 3,
    worldName: 'Đỉnh cao Sáng tạo',
    name: 'Nghệ thuật Tổng hợp',
    chapter: 'Chương 6',
    description: 'Biến kết quả AI thành sản phẩm giá trị của riêng bạn',
    icon: Crown,
    status: 'locked',
    color: 'from-yellow-400 to-orange-500'
  },
  // World 2: Realm of Skills
  {
    id: 5,
    world: 2,
    worldName: 'Lãnh địa Kỹ năng',
    name: 'Nghệ thuật Trách nhiệm',
    chapter: 'Chương 5',
    description: 'Rèn luyện ý thức đạo đức và trách nhiệm',
    icon: Compass,
    status: 'locked',
    color: 'from-teal-400 to-green-500'
  },
  {
    id: 4,
    world: 2,
    worldName: 'Lãnh địa Kỹ năng',
    name: 'Nghệ thuật Nhận định',
    chapter: 'Chương 4',
    description: 'Rèn luyện tư duy phản biện và đánh giá chất lượng',
    icon: Trophy,
    status: 'locked',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 3,
    world: 2,
    worldName: 'Lãnh địa Kỹ năng',
    name: 'Nghệ thuật Mô tả',
    chapter: 'Chương 3',
    description: 'Rèn luyện kỹ năng giao tiếp chính xác với AI',
    icon: MapPin,
    status: 'locked',
    color: 'from-purple-400 to-pink-500'
  },
  {
    id: 2,
    world: 2,
    worldName: 'Lãnh địa Kỹ năng',
    name: 'Nghệ thuật Phân công',
    chapter: 'Chương 2',
    description: 'Rèn luyện tư duy chiến lược và lập kế hoạch',
    icon: Compass,
    status: 'current',
    color: 'from-green-400 to-blue-500'
  },
  // World 1: Genesis of Thought
  {
    id: 1,
    world: 1,
    worldName: 'Khởi nguồn Tư duy',
    name: 'Nền tảng Tư duy',
    chapter: 'Chương 1',
    description: 'Hiểu tại sao cần học và những gì đang chờ đợi bạn',
    icon: Lightbulb,
    status: 'completed',
    color: 'from-blue-400 to-purple-600'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className='w-6 h-6 text-green-500' />;
    case 'current':
      return <Circle className='w-6 h-6 text-primary animate-pulse' />;
    case 'locked':
      return <Lock className='w-6 h-6 text-muted-foreground' />;
    default:
      return <Circle className='w-6 h-6 text-muted-foreground' />;
  }
};

const getNextStation = () => {
  return journeyStations.find((station) => station.status === 'current');
};

export default function SkillHubPage() {
  const progressPercentage = (userProgress.completedStations / userProgress.totalStations) * 100;
  const nextStation = getNextStation();

  return (
    <div className='bg-background text-foreground transition-colors'>
      <div className='max-w-7xl mx-auto px-4 py-8 lg:px-8'>
        {/* Welcome Header */}
        <div className='mb-8'>
          <h1 className='text-4xl font-bold mb-2 text-foreground'>
            Chào mừng trở lại, {userProgress.userName}! 👋
          </h1>
          <p className='text-lg text-muted-foreground'>
            Hành trình rèn luyện năng lực AI của bạn đang tiếp tục
          </p>
        </div>

        {/* Progress Summary */}
        <Card className='mb-8 bg-card text-card-foreground border-border'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Trophy className='w-5 h-5 text-primary' />
              Tóm tắt Tiến trình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Tiến độ hoàn thành</span>
                <span className='text-sm text-muted-foreground'>
                  {userProgress.completedStations}/{userProgress.totalStations} kỹ năng cốt lõi
                </span>
              </div>
              <Progress value={progressPercentage} className='h-3 bg-muted' />
              <p className='text-sm text-muted-foreground'>
                Bạn đã hoàn thành <strong>{userProgress.completedStations}</strong> trong tổng số{' '}
                <strong>{userProgress.totalStations}</strong> chặng hành trình
              </p>
            </div>
          </CardContent>
        </Card>

        <div className='grid lg:grid-cols-3 gap-8'>
          {/* Journey Map  */}
          <div className='lg:col-span-2'>
            <Card className='bg-card text-card-foreground border-border'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <MapPin className='w-5 h-5 text-primary' />
                  Bản đồ Hành trình
                </CardTitle>
                <CardDescription>
                  Con đường rèn luyện năng lực AI được chia thành 3 khu vực với 6 chặng đào tạo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='relative'>
                  <svg
                    className='absolute inset-0 w-full h-full z-0'
                    viewBox='0 0 600 1400'
                    preserveAspectRatio='xMidYMid meet'>
                    <path
                      d='M 420 200
     C 450 100, 150 100, 150 350
     C 150 600, 450 600, 450 850
     C 450 950, 150 950, 200 1200'
                      stroke='currentColor'
                      strokeWidth='5'
                      fill='none'
                      className='text-border opacity-50'
                      strokeDasharray='15,5'
                    />
                  </svg>
                  {/* Journey Stations */}
                  <div className='relative z-10 space-y-8'>
                    <div className='text-center mb-6'>
                      <Badge variant='secondary' className='mb-2'>
                        Khu vực 3
                      </Badge>
                      <h3 className='text-xl font-semibold text-foreground'>
                        🏔️ Đỉnh cao Sáng tạo
                      </h3>
                    </div>

                    <div className='flex justify-center'>
                      {journeyStations.slice(0, 1).map((station) => (
                        <StationCard key={station.id} station={station} />
                      ))}
                    </div>

                    <div className='text-center mb-6 mt-12'>
                      <Badge variant='secondary' className='mb-2'>
                        Khu vực 2
                      </Badge>
                      <h3 className='text-xl font-semibold text-foreground'>⚔️ Lãnh địa Kỹ năng</h3>
                    </div>

                    <div className='grid grid-cols-2 gap-6 max-w-2xl mx-auto'>
                      {journeyStations.slice(1, 5).map((station, index) => (
                        <div
                          key={station.id}
                          className={`${
                            index % 2 === 0 ? 'justify-self-start' : 'justify-self-end'
                          }`}>
                          <StationCard station={station} />
                        </div>
                      ))}
                    </div>

                    <div className='text-center mb-6 mt-12'>
                      <Badge variant='secondary' className='mb-2'>
                        Khu vực 1
                      </Badge>
                      <h3 className='text-xl font-semibold text-foreground'>
                        🌅 Khởi nguồn Tư duy
                      </h3>
                    </div>

                    <div className='flex justify-center'>
                      {journeyStations.slice(5, 6).map((station) => (
                        <StationCard key={station.id} station={station} />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='space-y-6'>
            {nextStation && (
              <Card className='border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5'>
                <CardHeader>
                  <CardTitle className='text-lg'>🚀 Tiếp tục Hành trình</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <h4 className='font-semibold text-foreground'>Trạm tiếp theo:</h4>
                    <p className='text-sm text-muted-foreground'>{nextStation.name}</p>
                  </div>
                  <Button className='w-full' size='lg' asChild>
                    <Link href={`/skill-hub/dojo/${nextStation.id}`}>Bắt đầu Rèn luyện</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Knowledge Treasury Access */}
            <Card className='bg-card text-card-foreground border-border'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2 text-lg'>
                  <BookOpen className='w-5 h-5 text-secondary' />
                  Kho Báu Tri thức
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground mb-4'>
                  Truy cập thư viện tra cứu và tài liệu hỗ trợ học tập
                </p>
                <Button variant='outline' className='w-full' asChild>
                  <Link href='/skill-hub/knowledge-vault'>Khám phá Kho Báu</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className='bg-card text-card-foreground border-border'>
              <CardHeader>
                <CardTitle className='text-lg'>📊 Thống kê nhanh</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Kỹ năng đã thành thạo</span>
                  <Badge variant='secondary'>{userProgress.completedStations}</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Tiến độ hoàn thành</span>
                  <Badge variant='outline'>{Math.round(progressPercentage)}%</Badge>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm'>Khu vực hiện tại</span>
                  <Badge variant='default'>
                    {nextStation ? nextStation.worldName : 'Hoàn thành'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StationCard({ station }: { station: (typeof journeyStations)[0] }) {
  const IconComponent = station.icon;

  return (
    <Card
      className={`
        relative w-64 transition-all duration-300 hover:scale-105 cursor-pointer
        ${station.status === 'current' ? 'ring-2 ring-primary ring-offset-2 shadow-lg' : ''}
        ${station.status === 'locked' ? 'opacity-60 cursor-not-allowed' : ''}
        ${
          station.status === 'completed'
            ? 'bg-gradient-to-br from-chart-1/10 to-chart-2/10 dark:from-chart-1/30 dark:to-chart-2/30'
            : 'bg-card'
        }
        text-card-foreground border-border
      `}>
      <Link
        href={station.status !== 'locked' ? `/skill-hub/dojo/${station.id}` : '#'}
        className={station.status === 'locked' ? 'pointer-events-none' : ''}>
        <CardHeader className='pb-3'>
          <div className='flex items-start justify-between'>
            <div className={`p-3 rounded-lg bg-gradient-to-br ${station.color} text-white`}>
              <IconComponent className='w-6 h-6' />
            </div>
            {getStatusIcon(station.status)}
          </div>
          <div className='space-y-1'>
            <Badge variant='outline' className='text-xs border-border text-foreground'>
              {station.chapter}
            </Badge>
            <CardTitle className='text-lg leading-tight'>{station.name}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className='text-sm text-muted-foreground'>{station.description}</p>
          {station.status === 'current' && (
            <div className='mt-3'>
              <Button size='sm' className='w-full'>
                Bắt đầu
              </Button>
            </div>
          )}
          {station.status === 'completed' && (
            <div className='mt-3'>
              <Button size='sm' variant='outline' className='w-full'>
                Xem lại
              </Button>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
