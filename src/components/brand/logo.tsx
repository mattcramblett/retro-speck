import { SquareKanban } from 'lucide-react';
import Link from 'next/link';
import { ExoticComponent } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps extends React.HTMLAttributes<ExoticComponent>{
  size?: number,
  linkToHome?: boolean
  className?: string | undefined
};

export function Logo({ size, linkToHome, className }: LogoProps) {

  function LogoImage() {
    // This is just an icon as a placeholder logo
    return (
      <SquareKanban width={size || 50} height={size || 50} className={cn('text-muted-foreground', className)} />
    )
  }

  if (linkToHome) {
    return <Link href={"/"}>
      {LogoImage()}
    </Link>
  }

  return LogoImage();
}
