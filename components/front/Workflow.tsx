import React from 'react';
import Card from '../ui/Card';

function Workflow() {
  return (
    <section className="flex flex-col gap-12">
      <div className="intro ">
        <h2 className="text-3xl md:text-5xl font-bold  tracking-tighter">
          Empower Your Workflow with AI
        </h2>
        <p className="mt-4 text-lg ">
          Showcasing my ability to integrate AI, build complex automations, and
          deliver robust full-stack solutions.
        </p>
      </div>
      <div className="grid grid-cols-2 grid-gap-8 gap-8">
        <Card
          title="AI-Driven Workflow Automation"
          content="Developed a comprehensive workflow automation system using N8N, integrating AI services to streamline business processes and enhance productivity."
          image="/card1.png"
          alt="AI-Driven Workflow Automation"
        />
        <Card
          title="N8N Automated CRM Sync"
          content="Complex workflow automation syncing data across Salesforce, Hubspot, and internal databases in real-time."
          image="/card2.png"
          alt="N8N Automated CRM Sync"
        />
        <Card
          title="Real-time Data Analytics Dashboard"
          content="Full-stack application using Next.js, Node.js, and WebSockets to visualize live business metrics."
          image="/card3.png"
          alt="Real-time Data Analytics Dashboard"
        />
        <Card
          title="E-commerce Platform with AI Search"
          content="Developed a performant e-commerce site with an AI-driven semantic search feature for superior product discovery."
          image="/card4.png"
          alt="E-commerce Platform with AI Search"
        />
      </div>
    </section>
  );
}

export default Workflow;
