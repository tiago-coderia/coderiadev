import React from 'react';

function CardTec(props: {
  title: string;
  content: string;
  image: string;
  alt: string;
}) {
  return (
    <div className="bg-background dark:bg-[#111111] p-8 rounded-2xl border border-foreground/20">
      <h3 className="text-xl font-bold text-foreground">{props.title}</h3>
      <p className="mt-2 text-muted-foreground">{props.content}</p>
      <div className="mt-6 bg-gray-200 dark:bg-gray-900/50 p-4 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-800">
        <img
          src={props.image}
          alt={props.alt}
          className="rounded w-full h-auto object-cover"
        />
      </div>
    </div>
  );
}

export default CardTec;
