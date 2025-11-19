'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function Cta() {
  const [buttonText, setButtonText] = useState('Entre em contato');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('tiago.coderia@gmail.com');
    setButtonText('Email Copiado!');

    setTimeout(() => {
      setButtonText('Entre em contato');
    }, 2000); // Volta ao texto original após 2 segundos
  };

  return (
    <section className="flex flex-col gap-8 w-2/3 mx-auto" id="contato">
      <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
        Pronto para construir algo incrível?
      </h2>
      <p className="text-lg text-muted-foreground">
        Vamos conversar! Estou disponível para projetos freelance e
        oportunidades de consultoria. Entre em contato para discutirmos como
        posso ajudar você a alcançar seus objetivos.
      </p>
      <div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" onClick={handleCopyEmail}>
              {buttonText}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Clique para Copiar o Email</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </section>
  );
}

export default Cta;
