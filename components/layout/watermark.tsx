'use client'

import Image from 'next/image'

export default function Watermark() {
  return (
    <div className="watermark">
      {/* Light mode: show light background logo */}
      <Image
        src="/images/raahi-logo-light.jpeg"
        alt=""
        width={800}
        height={800}
        className="block dark:hidden object-contain w-[65vw] max-w-3xl"
        priority
      />
      {/* Dark mode: show dark background logo */}
      <Image
        src="/images/raahi-logo-dark.png"
        alt=""
        width={800}
        height={800}
        className="hidden dark:block object-contain w-[65vw] max-w-3xl"
        priority
      />
    </div>
  )
}
