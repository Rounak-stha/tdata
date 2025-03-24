interface LogoProps {
  size?: number;
}

export const Logo = ({ size }: LogoProps) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="60" height="8" rx="4" fill="#4F46E5" />
      <rect x="20" y="46" width="40" height="8" rx="4" fill="#06B6D4" />
      <rect x="20" y="62" width="50" height="8" rx="4" fill="#10B981" />
      <line x1="50" y1="20" x2="50" y2="80" stroke="#4F46E5" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="30" r="6" fill="#4F46E5" />
      <circle cx="50" cy="50" r="6" fill="#4F46E5" />
      <circle cx="50" cy="70" r="6" fill="#4F46E5" />
    </svg>
  );
};
