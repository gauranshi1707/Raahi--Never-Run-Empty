'use client'

import Image from 'next/image'

export default function Watermark() {
  return (
    <div className="watermark">
      {/* Light mode: show light background logo */}
      <Image
        src="/images/raahi-logo-light.jpeg"
        alt="Raahi"
        width={400}
        height={400}
        className="block dark:hidden object-contain"
        priority
      />
      {/* Dark mode: show dark background logo */}
      <Image
        src="/images/raahi-logo-dark.png"
        alt="Raahi"
        width={400}
        height={400}
        className="hidden dark:block object-contain"
        priority
      />
    </div>
  )
}
