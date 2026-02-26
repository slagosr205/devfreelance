import { SVGAttributes } from 'react';

export default function ApplicationLogo(props: SVGAttributes<SVGElement>) {
    return (
        <svg
            {...props}
            viewBox="0 0 950 320"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(90,90)">
                <rect x="0" y="0" width="110" height="110" rx="18" fill="#0f172a"/>
                <circle cx="30" cy="30" r="6" fill="#00aaff"/>
                <circle cx="80" cy="30" r="6" fill="#00aaff"/>
                <circle cx="30" cy="80" r="6" fill="#00aaff"/>
                <circle cx="80" cy="80" r="6" fill="#00aaff"/>
                <line x1="30" y1="30" x2="80" y2="30" stroke="#00aaff" strokeWidth="2"/>
                <line x1="30" y1="30" x2="30" y2="80" stroke="#00aaff" strokeWidth="2"/>
                <line x1="80" y1="30" x2="80" y2="80" stroke="#00aaff" strokeWidth="2"/>
                <line x1="30" y1="80" x2="80" y2="80" stroke="#00aaff" strokeWidth="2"/>
            </g>
            <text x="260" y="165" fontFamily="Segoe UI, Arial, sans-serif" fontSize="70" fontWeight="600" fill="#0f172a">
                Lineth<tspan fill="#00aaff">Hn</tspan>
            </text>
            <text x="260" y="210" fontFamily="Segoe UI" fontSize="22" fill="#64748b" letterSpacing="2">
                Links&amp;Tech by Honduras
            </text>
        </svg>
    );
}
