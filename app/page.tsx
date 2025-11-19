import Hero from '@/components/front/Hero';
import Header from '../components/front/Header';
import Workflow from '@/components/front/Workflow';
import Services from '@/components/front/Services';

export default function Home() {
  return (
    <div className="flex flex-col">
      <header className="w-full fixed bg-background/30 border-b border-background backdrop-blur-sm  z-50">
        <Header />
      </header>
      <div className="flex flex-col w-container gap-20 text-center">
        <Hero />
        <Workflow />
        <Services />
      </div>
    </div>
  );
}
