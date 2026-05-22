export const LogoSteps = ({ className = "w-16 h-16" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bloque Superior (Meta) */}
        <path d="M50,20 L68,29 L50,38 L32,29 Z" fill="#34D399" />
        <path d="M32,29 L50,38 L50,50 L32,41 Z" fill="#059669" />
        <path d="M50,38 L68,29 L68,41 L50,50 Z" fill="#047857" />

        {/* Bloque Medio */}
        <path d="M32,41 L50,50 L32,59 L14,50 Z" fill="#22D3EE" />
        <path d="M14,50 L32,59 L32,71 L14,62 Z" fill="#0891B2" />
        <path d="M32,59 L50,50 L50,62 L32,71 Z" fill="#0E7490" />

        {/* Bloque Inferior (Origen) Moradito*/}
        <path d="M50,62 L68,71 L50,80 L32,71 Z" fill="#632cb8" />
        <path d="M32,71 L50,80 L50,91 L32,82  Z" fill="#561DA8" />
        <path d="M50,80 L68,71 L68,82 L50,91 Z" fill="#481296" />

        {/* Línea de ruta lógica (Puntos y pasos) */}
        <path d="M50,29 L40,35 L 40,46 L32,50 L42,55 L 42,66 L 50,70" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="3 3" strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx="50" cy="29" rx="2.5" ry="2" fill="#ffffff" />
        <ellipse cx="32" cy="50" rx="2.5" ry="2" fill="#ffffff" />
        <ellipse cx="50" cy="70" rx="2.5" ry="2" fill="#ffffff" />
    </svg>
);