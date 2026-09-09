import { HomeHeader } from "@/widgets/home/home-header";
import { BannerSection } from "@/widgets/home/banner-section";
import { ActionCards } from "@/widgets/home/action-cards";
import { RecentGames } from "@/widgets/home/recent-games";
import { NewsSection } from "@/widgets/home/news-section";

export function LobbyView() {
  return (
    <div className="max-w-[1200px] mx-auto w-full h-full flex flex-col">
      <HomeHeader />
      <BannerSection />
      <ActionCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 min-h-0 overflow-hidden">
        <RecentGames />
        <NewsSection />
      </div>
    </div>
  );
}
