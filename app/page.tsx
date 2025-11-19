import Hero from '@/components/front/Hero';
import Header from '../components/front/Header';
import Workflow from '@/components/front/Workflow';
import Services from '@/components/front/Services';
import Cta from '@/components/front/Cta';
import Footer from '@/components/front/Footer';

export default function Home() {
  return (
    <div className="flex flex-col gap-36">
      <header className="w-full fixed bg-background/30 border-b border-background backdrop-blur-sm  z-50">
        <Header />
      </header>
      <main className="flex flex-col gap-20">
        <div className="flex flex-col gap-20 w-container text-center">
          <Hero />
          <Workflow />
        </div>
        <div className="flex flex-col w-full text-center bg-[#17151e] py-20">
          <div className="w-container ">
            <Services />
          </div>
        </div>
        <div className="flex flex-col w-container gap-20 text-center">
          <Cta />
        </div>
      </main>
      <footer>
        <div className="flex flex-col gap-8">
          <div className="w-full bg-[#17151e] py-10">
            <div className="flex flex-col w-container gap-20 text-center ">
              <Footer />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
