import Image from 'next/image';
import React from 'react';

interface ButtonProps {
  icon: string;
  iconAlt: string;
  title: string;
  text: string;
  className: string;
}

function CardSevice({ icon, iconAlt, title, text, className }: ButtonProps) {
  return (
    <div className={className}>
      <div className="inline-flex items-center justify-center w-12 h-12 bg-secondary text-primary rounded-lg mb-4 bg-card-primary">
        <Image src={icon} alt={iconAlt} width={24} height={24} />
      </div>
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-muted-foreground">{text}</p>
    </div>
  );
}

export default CardSevice;
