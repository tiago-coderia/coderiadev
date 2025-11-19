import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Header() {
  return (
    <div className="flex items-center justify-between p-4 w-container">
      <Image
        src="/logocompleta.svg"
        alt="Coderia Logo"
        width={220}
        height={80}
      />
      <nav>
        <ul className="flex gap-26">
          <li>
            <Link href="#">Projects</Link>
          </li>
          <li>
            <Link href="#about">Services</Link>
          </li>
          <li>
            <Link href="#contact">Testemonial</Link>
          </li>
        </ul>
      </nav>

      <Button variant="outline">Contact Me</Button>
    </div>
  );
}

export default Header;
