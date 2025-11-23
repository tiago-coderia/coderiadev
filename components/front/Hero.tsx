import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function Hero() {
  return (
    <section className="flex flex-col pt-32 gap-12 gradient-bg justify-center items-center px-8">
      <Image
        src="/logocoderia-v.svg"
        alt="Hero Image"
        width={200}
        height={200}
      />
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tighter">
        Construindo Aplicações <br /> Web Inteligentes
      </h1>
      <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
        Desenvolvedor FullStack e de IA especializado em automações N8N, Next.js
        e Node.js para criar aplicações inteligentes, escaláveis ​​e eficientes.
      </p>
      <div className="flex gap-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">Ver meus projetos</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Em construção!</p>
          </TooltipContent>
        </Tooltip>

        {/* <Button variant="secondary">GitHub</Button> */}
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent pointer-events-none"></div>
        <div className="bg-background  p-2 sm:p-4 rounded-xl  border border-gray-800">
          <img
            src="/wallpaper2.png"
            alt="n8n Work Example"
            className="rounded-lg aspect-4/2 object-fill"
            width={1160}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
