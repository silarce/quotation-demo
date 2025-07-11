
declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
    import type { StaticImport } from 'next/dist/shared/lib/get-img-props';
    
    
  const content:  StaticImport['StaticImageData'];
  export default content
}