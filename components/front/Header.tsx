'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

function Header() {
  const [buttonText, setButtonText] = useState('Entre em contato');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('tiago.coderia@gmail.com');
    setButtonText('Email Copiado!');

    setTimeout(() => {
      setButtonText('Entre em contato');
    }, 2000); // Volta ao texto original após 2 segundos
  };
  return (
    <div className="flex items-center justify-between py-4 w-container">
      <Link href="/">
        <Image
          src="/logocompleta.svg"
          alt="Coderia Logo"
          width={200}
          height={46}
        />
      </Link>
      <div className="flex gap-8 justify-center items-center">
        <Link href="#potencialize">Porque IA?</Link>
        <Link href="#servicos">Serviços</Link>
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
    </div>
  );
}

export default Header;
