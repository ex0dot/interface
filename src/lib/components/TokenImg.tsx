import { NativeCurrency } from '@uniswap/sdk-core'
import useNativeEvent from 'lib/hooks/useNativeEvent'
import styled from 'lib/theme'
import uriToHttp from 'lib/utils/uriToHttp'
import { useState } from 'react'
import { WrappedTokenInfo } from 'state/lists/wrappedTokenInfo'

const TRANSPARENT_SRC = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

interface TokenImgProps {
  className?: string
  token: WrappedTokenInfo | NativeCurrency
}

// TODO(zzmp): See getTokenLogoURL

function TokenImg({ className, token }: TokenImgProps) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  let src
  if (token.isToken) {
    src = token.logoURI ? uriToHttp(token.logoURI)[0] : TRANSPARENT_SRC
  } else if (token.isNative) {
    src = TRANSPARENT_SRC // TODO(zzmp)
  }
  useNativeEvent(img, 'error', () => {
    if (img) {
      // Use a local transparent gif to avoid the browser-dependent broken img icon.
      // The icon may still flash, but using a native event further reduces the duration.
      img.src = TRANSPARENT_SRC
    }
  })
  return <img className={className} src={src} alt={token.name || token.symbol} ref={setImg} />
}

export default styled(TokenImg)<{ size?: number }>`
  // radial-gradient calculates distance from the corner, not the edge: divide by sqrt(2)
  background: radial-gradient(
    ${({ theme }) => theme.module} calc(100% / ${Math.sqrt(2)} - 1.5px),
    ${({ theme }) => theme.outline} calc(100% / ${Math.sqrt(2)} - 1.5px)
  );
  border-radius: 100%;
  height: ${({ size }) => size || 1}em;
  width: ${({ size }) => size || 1}em;
`
