import React from 'react';
import { Button } from '@/components/ui/button';

function Cta() {
  return (
    <section className="flex flex-col gap-8 w-2/3 mx-auto">
      <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
        Pronto para construir algo incrível?
      </h2>
      <p className="text-lg text-muted-foreground">
        Vamos conversar! Estou disponível para projetos freelance e
        oportunidades de consultoria. Entre em contato para discutirmos como
        posso ajudar você a alcançar seus objetivos.
      </p>
      <div className="">
        <Button variant="default">Entre em contato</Button>
      </div>
    </section>
  );
}

export default Cta;
