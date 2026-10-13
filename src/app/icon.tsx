export const runtime = 'edge';

export const size = { width: 32, height: 32 };
export const contentType = 'image/svg+xml';

export default function Icon() {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#7C3AED" />
          <stop offset="100%" stop-color="#4C1D95" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#grad)" />
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#FDE68A" font-family="sans-serif" font-size="20" font-weight="bold">$</text>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}