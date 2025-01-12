'use client'

import { useEffect, useState } from "react"

 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const [hasRetried, setHasRetried] = useState(false);

  useEffect(() => {
    if (!hasRetried) {
      console.error(error);
      setHasRetried(true);
      reset();
    }
  // NOTE: Only want to reset once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
