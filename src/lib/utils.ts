import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function uuidv4() {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16),
  );
}

export function obfuscate(input: string): string {
  // base 64 encode to scramble the text
  const result = btoa(input.replaceAll(/[^a-z|A-Z|\d]*/g, " "));
  if (result.length < 8) {
    return result;
  }
  // Trim randomly off the front and end so the result is more stochastic
  const rand1 = Math.floor(Math.random() * 4);
  const rand2 = Math.floor(Math.random() * 4);
  return result.slice(0 + rand1, input.length - rand2);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Retry a basic function, try it x number of times
export async function withRetry<R>(
  fun: () => Promise<R>,
  attempts: number = 1,
): Promise<R> {
  let retryCount = 0;

  while (retryCount < attempts) {
    try {
      return await fun();
    } catch (e) {
      retryCount += 1;
      console.warn("attempted function and encountered error, retrying", e);
      await sleep(100); // slight buffer, but don't add too much latency
    }
  }
  // Last attempt - either successful or throw error
  return await fun();
}
