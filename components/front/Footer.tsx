import Image from 'next/image';
import { Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

function Footer() {
  return (
    <div className="flex justify-between px-8">
      <div className="text-center md:text-left">
        <Image
          src="/logocompleta.svg"
          alt="Coderia Logo"
          width={146}
          height={23}
        />

        <p className="text-sm text-muted-foreground mt-1">
          AI &amp; FullStack Developer
        </p>
      </div>
      <Image
        src="/logocoderia-v.svg"
        alt="Coderia Logo"
        width={36}
        height={26}
      />
      <div className="flex items-center space-x-6">
        <Link
          href="https://www.linkedin.com/in/tiago-coderia/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Linkedin
            color={`var(--color-primary)`}
            size={24}
            fill={`var(--color-primary)`}
            strokeWidth="0"
          />
        </Link>
        <Link
          href="https://www.github.com/tiago-coderia"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github
            color={`var(--color-primary)`}
            size={24}
            fill={`var(--color-primary)`}
            strokeWidth="0"
          />
        </Link>
      </div>
    </div>
  );
}

export default Footer;
