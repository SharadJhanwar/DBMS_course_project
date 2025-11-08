import React, { useRef, useEffect, useState } from 'react';

export default function Chef3D() {
  const svgRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);
  const leftLidRef = useRef(null);
  const rightLidRef = useRef(null);
  const chefGroupRef = useRef(null);
  
  const [isBlinking, setIsBlinking] = useState(false);
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Mouse/touch tracking
    const handleMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || 0;

      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Normalized position (-1 to 1)
        targetPos.current.x = (clientX - centerX) / (rect.width / 2);
        targetPos.current.y = (clientY - centerY) / (rect.height / 2);
      }
    };

    // Click to blink
    const handleClick = () => {
      if (!isBlinking) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    };

    // Auto-blink
    const blinkInterval = setInterval(() => {
      if (!isBlinking) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 150);
      }
    }, 3000 + Math.random() * 3000);

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('click', handleClick);

    // Animation loop for smooth pupil movement
    let rafId;
    const animate = () => {
      // Smooth lerp
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.1;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.1;

      // Update pupil positions
      if (leftPupilRef.current && rightPupilRef.current && !isBlinking) {
        const maxMove = 8;
        const offsetX = currentPos.current.x * maxMove;
        const offsetY = currentPos.current.y * maxMove;

        leftPupilRef.current.setAttribute('transform', `translate(${offsetX}, ${offsetY})`);
        rightPupilRef.current.setAttribute('transform', `translate(${offsetX}, ${offsetY})`);
      }

      // Update head tilt
      if (chefGroupRef.current) {
        const tilt = currentPos.current.x * 3;
        chefGroupRef.current.setAttribute('transform', `translate(150, 150) rotate(${tilt})`);
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('click', handleClick);
      clearInterval(blinkInterval);
      cancelAnimationFrame(rafId);
    };
  }, [isBlinking]);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto perspective-1000">
      <svg
        ref={svgRef}
        viewBox="0 0 300 300"
        className="w-full h-full drop-shadow-2xl transform-gpu transition-transform duration-200 hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
        style={{ 
          filter: 'drop-shadow(0 20px 60px rgba(0,0,0,0.3))',
          transform: 'rotateX(5deg) rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        <defs>
          {/* Gradients for 3D effect */}
          <linearGradient id="hatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#f8f8f8', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#e8e8e8', stopOpacity: 1 }} />
          </linearGradient>

          <radialGradient id="faceGradient" cx="40%" cy="40%">
            <stop offset="0%" style={{ stopColor: '#ffe4c4', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#ffd4a3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffb887', stopOpacity: 1 }} />
          </radialGradient>

          <radialGradient id="pupilGradient" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#4a4a4a', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1a1a1a', stopOpacity: 1 }} />
          </radialGradient>

          <radialGradient id="noseGradient" cx="30%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#ffcca3', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#ffb080', stopOpacity: 1 }} />
          </radialGradient>

          {/* Shadows */}
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="4" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="innerShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
            <feOffset dx="0" dy="2"/>
            <feComposite operator="out" in2="SourceAlpha"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
          </filter>
        </defs>

        {/* Chef group with rotation */}
        <g ref={chefGroupRef} transform="translate(150, 150)" style={{ transition: 'transform 0.3s ease-out' }}>
          {/* Chef's Hat */}
          <g filter="url(#softShadow)">
            {/* Hat top (puffy part) */}
            <ellipse cx="0" cy="-70" rx="60" ry="35" fill="url(#hatGradient)" stroke="#e0e0e0" strokeWidth="1"/>
            <ellipse cx="0" cy="-75" rx="55" ry="30" fill="url(#hatGradient)" opacity="0.9"/>
            <ellipse cx="0" cy="-80" rx="50" ry="28" fill="url(#hatGradient)" opacity="0.8"/>
            
            {/* Hat band/rim */}
            <ellipse cx="0" cy="-40" rx="68" ry="12" fill="#ffffff" stroke="#d0d0d0" strokeWidth="1"/>
            <ellipse cx="0" cy="-42" rx="68" ry="8" fill="#f5f5f5"/>
          </g>

          {/* Face shadow under hat */}
          <ellipse cx="0" cy="-35" rx="65" ry="10" fill="rgba(0,0,0,0.08)"/>

          {/* Head/Face */}
          <g filter="url(#softShadow)">
            <ellipse cx="0" cy="0" rx="75" ry="85" fill="url(#faceGradient)" stroke="#ffb887" strokeWidth="1"/>
            
            {/* Chin highlight */}
            <ellipse cx="0" cy="50" rx="60" ry="30" fill="rgba(255,228,196,0.5)"/>
            
            {/* Cheek shadows for depth */}
            <ellipse cx="-40" cy="10" rx="25" ry="20" fill="rgba(255,180,120,0.3)" filter="url(#innerShadow)"/>
            <ellipse cx="40" cy="10" rx="25" ry="20" fill="rgba(255,180,120,0.3)" filter="url(#innerShadow)"/>
          </g>

          {/* Ears */}
          <g opacity="0.9">
            <ellipse cx="-68" cy="5" rx="12" ry="18" fill="url(#faceGradient)" stroke="#ffb887" strokeWidth="0.5"/>
            <ellipse cx="-70" cy="5" rx="6" ry="10" fill="rgba(255,180,120,0.4)"/>
            
            <ellipse cx="68" cy="5" rx="12" ry="18" fill="url(#faceGradient)" stroke="#ffb887" strokeWidth="0.5"/>
            <ellipse cx="70" cy="5" rx="6" ry="10" fill="rgba(255,180,120,0.4)"/>
          </g>

          {/* Eyes */}
          <g id="leftEye">
            {/* Eye socket shadow */}
            <ellipse cx="-28" cy="-8" rx="22" ry="18" fill="rgba(0,0,0,0.06)"/>
            
            {/* Eye white */}
            <ellipse cx="-28" cy="-10" rx="20" ry="16" fill="#ffffff" stroke="#e0d0c0" strokeWidth="1"/>
            
            {/* Eyelid (for blinking) */}
            {isBlinking ? (
              <g ref={leftLidRef}>
                <path 
                  d="M -48 -10 Q -28 -5 -8 -10" 
                  stroke="#ffb887" 
                  strokeWidth="16" 
                  strokeLinecap="round"
                  fill="url(#faceGradient)"
                />
                <path 
                  d="M -48 -10 Q -28 -8 -8 -10" 
                  stroke="#d4a078" 
                  strokeWidth="1.5" 
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g ref={leftPupilRef}>
                {/* Iris */}
                <circle cx="-28" cy="-10" r="8" fill="url(#pupilGradient)"/>
                {/* Pupil */}
                <circle cx="-28" cy="-10" r="4" fill="#000000"/>
                {/* Highlight */}
                <circle cx="-25" cy="-13" r="2.5" fill="#ffffff" opacity="0.9"/>
                <circle cx="-31" cy="-8" r="1.2" fill="#ffffff" opacity="0.6"/>
              </g>
            )}
          </g>

          <g id="rightEye">
            {/* Eye socket shadow */}
            <ellipse cx="28" cy="-8" rx="22" ry="18" fill="rgba(0,0,0,0.06)"/>
            
            {/* Eye white */}
            <ellipse cx="28" cy="-10" rx="20" ry="16" fill="#ffffff" stroke="#e0d0c0" strokeWidth="1"/>
            
            {/* Eyelid (for blinking) */}
            {isBlinking ? (
              <g ref={rightLidRef}>
                <path 
                  d="M 8 -10 Q 28 -5 48 -10" 
                  stroke="#ffb887" 
                  strokeWidth="16" 
                  strokeLinecap="round"
                  fill="url(#faceGradient)"
                />
                <path 
                  d="M 8 -10 Q 28 -8 48 -10" 
                  stroke="#d4a078" 
                  strokeWidth="1.5" 
                  fill="none"
                  strokeLinecap="round"
                />
              </g>
            ) : (
              <g ref={rightPupilRef}>
                {/* Iris */}
                <circle cx="28" cy="-10" r="8" fill="url(#pupilGradient)"/>
                {/* Pupil */}
                <circle cx="28" cy="-10" r="4" fill="#000000"/>
                {/* Highlight */}
                <circle cx="31" cy="-13" r="2.5" fill="#ffffff" opacity="0.9"/>
                <circle cx="25" cy="-8" r="1.2" fill="#ffffff" opacity="0.6"/>
              </g>
            )}
          </g>

          {/* Eyebrows */}
          <path d="M -45 -25 Q -28 -32 -11 -25" stroke="#8b6914" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>
          <path d="M 11 -25 Q 28 -32 45 -25" stroke="#8b6914" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7"/>

          {/* Nose */}
          <ellipse cx="0" cy="8" rx="10" ry="14" fill="url(#noseGradient)" opacity="0.8"/>
          <ellipse cx="-3" cy="5" rx="3" ry="4" fill="rgba(255,255,255,0.4)"/>

          {/* Rosy cheeks */}
          <ellipse cx="-50" cy="15" rx="15" ry="12" fill="#ff9999" opacity="0.3"/>
          <ellipse cx="50" cy="15" rx="15" ry="12" fill="#ff9999" opacity="0.3"/>

          {/* Mustache */}
          <g opacity="0.9">
            {/* Left mustache */}
            <path 
              d="M -5 30 Q -20 28 -35 32 Q -45 36 -52 42" 
              stroke="#5c4033" 
              strokeWidth="6" 
              strokeLinecap="round" 
              fill="none"
            />
            <path 
              d="M -5 28 Q -18 25 -32 28" 
              stroke="#5c4033" 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none"
            />
            
            {/* Right mustache */}
            <path 
              d="M 5 30 Q 20 28 35 32 Q 45 36 52 42" 
              stroke="#5c4033" 
              strokeWidth="6" 
              strokeLinecap="round" 
              fill="none"
            />
            <path 
              d="M 5 28 Q 18 25 32 28" 
              stroke="#5c4033" 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none"
            />
          </g>

          {/* Smile */}
          <path 
            d="M -15 45 Q 0 52 15 45" 
            stroke="#b85450" 
            strokeWidth="2.5" 
            fill="none" 
            strokeLinecap="round"
          />
          
          {/* Smile inner */}
          <path 
            d="M -12 46 Q 0 50 12 46" 
            stroke="#d4736e" 
            strokeWidth="1" 
            fill="none" 
            strokeLinecap="round"
            opacity="0.6"
          />

          {/* Neck/Collar */}
          <ellipse cx="0" cy="85" rx="45" ry="20" fill="#ffffff" stroke="#e0e0e0" strokeWidth="1" opacity="0.95"/>
          <ellipse cx="0" cy="82" rx="45" ry="8" fill="#f5f5f5"/>
          
          {/* Scarf/Neckerchief accent */}
          <path 
            d="M -35 80 Q 0 90 35 80" 
            stroke="#ff6b35" 
            strokeWidth="4" 
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Decorative sparkles */}
        <g opacity="0.6">
          <circle cx="50" cy="50" r="2" fill="#ffd700">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="250" cy="80" r="1.5" fill="#ffd700">
            <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" begin="0.5s"/>
          </circle>
          <circle cx="70" cy="250" r="2.5" fill="#ffd700">
            <animate attributeName="opacity" values="0.4;1;0.4" dur="2.5s" repeatCount="indefinite" begin="1s"/>
          </circle>
        </g>
      </svg>

      {/* Decorative frame */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/10 pointer-events-none"></div>
      <div className="absolute -inset-2 rounded-3xl border border-white/5 pointer-events-none"></div>
    </div>
  );
}