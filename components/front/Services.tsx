import React from 'react';
import CardSevice from '../ui/CardSevice';

function Services() {
  return (
    <section className="flex flex-col gap-12">
      <div className="intro">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tighter">
          My Services
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          From individual features to complete applications, I offer a range of
          services to bring your ideas to life.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-8">
        <CardSevice
          icon="/icon1.svg"
          iconAlt=""
          title="AI & Machine Learning"
          text="Custom model development, API integration (OpenAI, etc.), and data processing pipelines."
          className="card-secondary"
        />
        <CardSevice
          icon="/icon2.svg"
          iconAlt=""
          title="AI & Machine Learning"
          text="Custom model development, API integration (OpenAI, etc.), and data processing pipelines."
          className="card-primary"
        />
        <CardSevice
          icon="/icon2.svg"
          iconAlt=""
          title="AI & Machine Learning"
          text="Custom model development, API integration (OpenAI, etc.), and data processing pipelines."
          className="card-secondary"
        />
      </div>
    </section>
  );
}

export default Services;
