import React from 'react';
import CardTec from '../ui/cardTec';

function Workflow() {
  return (
    <section className="flex flex-col gap-12">
      <div className="intro ">
        <h2 className="text-3xl md:text-5xl font-bold  tracking-tighter">
          Potencialize seu fluxo de trabalho com IA.
        </h2>
        <p className="mt-4 text-lg ">
          Demonstrando minha capacidade de integrar IA, construir automações
          complexas e entregar soluções robustas de pilha completa.
        </p>
      </div>
      <div className="grid grid-cols-2 grid-gap-8 gap-8">
        <CardTec
          title="Automação de fluxo de trabalho orientada por IA"
          content="Sistema abrangente de automação de fluxo de trabalho usando N8N, integrando serviços de IA para otimizar processos de negócios e aumentar a produtividade."
          image="/card1.png"
          alt="AI-Driven Workflow Automation"
        />
        <CardTec
          title="Sincronização automatizada de CRM N8N"
          content="Automação de fluxos de trabalho complexos, sincronizando dados em tempo real entre Salesforce, Hubspot e bancos de dados internos."
          image="/card2.png"
          alt="N8N Automated CRM Sync"
        />
        <CardTec
          title="Painel de análise de dados em tempo real"
          content="Aplicação full-stack que utiliza Next.js, Node.js e WebSockets para visualizar métricas de negócios em tempo real."
          image="/card3.png"
          alt="Real-time Data Analytics Dashboard"
        />
        <CardTec
          title="E-commerce com busca por IA e Chatbot"
          content="E-commerce de alto desempenho com um recurso de busca semântica baseado em IA para uma descoberta de produtos superior."
          image="/card4.png"
          alt="E-commerce Platform with AI Search"
        />
      </div>
    </section>
  );
}

export default Workflow;
