import MainLayout from '@/components/layout/MainLayout';
import HeroBanner from '@/components/dashboard/HeroBanner';
import LevelSection from '@/components/dashboard/LevelSection';
import CategorySection from '@/components/dashboard/CategorySection';
import RecentExamsTable from '@/components/dashboard/RecentExamsTable';

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="page-enter">
        <HeroBanner />
        <LevelSection />
        <CategorySection />
        <RecentExamsTable />
      </div>
    </MainLayout>
  );
}
