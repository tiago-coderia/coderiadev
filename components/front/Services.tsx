import React from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import Image from 'next/image';
function Services() {
  return (
    <section className="flex flex-col gap-12">
      <div className="intro">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
          Meus Serviços
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Desde funcionalidades individuais até aplicações completas, ofereço
          uma gama de serviços para dar vida às suas ideias.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-md mx-auto">
              <Image
                src="/icon1.svg"
                alt="AI & Machine Learning"
                width={20}
                height={20}
              />
            </div>
            <CardTitle>IA e aprendizado de máquina</CardTitle>
            <CardDescription>
              Desenvolvimento de modelos personalizados, integração de API
              (OpenAI, etc.) e pipelines de processamento de dados.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-md mx-auto">
              <Image
                src="/icon2.svg"
                alt="N8N Workflow Development"
                width={20}
                height={20}
              />
            </div>
            <CardTitle>Automação de fluxo de trabalho N8N</CardTitle>
            <CardDescription>
              Projetar, construir e manter automações complexas para otimizar
              seus processos de negócios.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-md mx-auto">
              <Image
                src="/icon3.svg"
                alt="Fullstack Development"
                width={20}
                height={20}
              />
            </div>
            <CardTitle>Desenvolvimento FullStack</CardTitle>
            <CardDescription>
              Desenvolvimento de aplicações de ponta a ponta utilizando Next.js,
              React, Node.js e bancos de dados modernos.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  );
}

export default Services;
