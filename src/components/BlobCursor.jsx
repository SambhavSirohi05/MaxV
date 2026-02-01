import { useEffect, useRef, useState } from 'react';
import './BlobCursor.css';

const BlobCursor = ({
    blobType = 'circle',
    fillColor = '#5227FF',
    trailCount = 3,
    sizes = [60, 125, 75],
    innerSizes = [20, 35, 25],
    innerColor = 'rgba(255,255,255,0.8)',
    opacities = [0.6, 0.6, 0.6],
    shadowColor = 'rgba(0,0,0,0.75)',
    shadowBlur = 5,
    shadowOffsetX = 10,
    shadowOffsetY = 10,
    filterStdDeviation = 30,
    useFilter = true,
    fastDuration = 0.1,
    slowDuration = 0.5,
    zIndex = 100,
}) => {
    const blobsRef = useRef([]);
    const positionsRef = useRef([]);
    const targetRef = useRef({ x: 0, y: 0 });
    const rafRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const lastFrameTimeRef = useRef(0);
    const FPS_LIMIT = 60;
    const FRAME_INTERVAL = 1000 / FPS_LIMIT;

    useEffect(() => {
        // Initialize positions
        positionsRef.current = Array(trailCount + 1)
            .fill(null)
            .map(() => ({ x: 0, y: 0 }));

        const handleMouseMove = (e) => {
            targetRef.current = { x: e.clientX, y: e.clientY };
            if (!isActive) setIsActive(true);
        };

        const handleMouseEnter = () => setIsActive(true);
        const handleMouseLeave = () => setIsActive(false);

        // Use passive listeners for performance
        document.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.addEventListener('mouseenter', handleMouseEnter, { passive: true });
        document.addEventListener('mouseleave', handleMouseLeave, { passive: true });

        const animate = (currentTime) => {
            // FPS throttling
            const deltaTime = currentTime - lastFrameTimeRef.current;

            if (deltaTime < FRAME_INTERVAL) {
                rafRef.current = requestAnimationFrame(animate);
                return;
            }

            lastFrameTimeRef.current = currentTime - (deltaTime % FRAME_INTERVAL);

            // Update positions with lerp
            positionsRef.current.forEach((pos, i) => {
                const target = i === 0 ? targetRef.current : positionsRef.current[i - 1];
                const lag = i === 0 ? fastDuration : slowDuration / (i + 1);

                pos.x += (target.x - pos.x) * lag;
                pos.y += (target.y - pos.y) * lag;

                // Update DOM
                const blob = blobsRef.current[i];
                if (blob) {
                    blob.style.transform = `translate(${pos.x}px, ${pos.y}px)`;
                }
            });

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [trailCount, fastDuration, slowDuration, isActive]);

    return (
        <>
            <style>{`
        .blob-cursor-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: ${zIndex};
        }
        
        .blob-cursor-blob {
          position: absolute;
          top: 0;
          left: 0;
          border-radius: 50%;
          pointer-events: none;
          will-change: transform;
          transition: opacity 0.3s ease;
        }
        
        .blob-cursor-blob.active {
          opacity: 1 !important;
        }
        
        .blob-cursor-blob.inactive {
          opacity: 0 !important;
        }
      `}</style>

            <div className="blob-cursor-container">
                {/* Main blob */}
                <div
                    ref={(el) => (blobsRef.current[0] = el)}
                    className={`blob-cursor-blob ${isActive ? 'active' : 'inactive'}`}
                    style={{
                        width: `${sizes[0]}px`,
                        height: `${sizes[0]}px`,
                        backgroundColor: fillColor,
                        opacity: isActive ? opacities[0] : 0,
                        filter: useFilter ? `blur(${filterStdDeviation}px)` : 'none',
                        boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: `${innerSizes[0]}px`,
                            height: `${innerSizes[0]}px`,
                            backgroundColor: innerColor,
                            borderRadius: '50%',
                        }}
                    />
                </div>

                {/* Trail blobs */}
                {Array.from({ length: trailCount }).map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (blobsRef.current[i + 1] = el)}
                        className={`blob-cursor-blob ${isActive ? 'active' : 'inactive'}`}
                        style={{
                            width: `${sizes[i + 1] || sizes[0]}px`,
                            height: `${sizes[i + 1] || sizes[0]}px`,
                            backgroundColor: fillColor,
                            opacity: isActive ? opacities[i + 1] || opacities[0] : 0,
                            filter: useFilter ? `blur(${filterStdDeviation * 0.8}px)` : 'none',
                            boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px ${shadowColor}`,
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: `${innerSizes[i + 1] || innerSizes[0]}px`,
                                height: `${innerSizes[i + 1] || innerSizes[0]}px`,
                                backgroundColor: innerColor,
                                borderRadius: '50%',
                            }}
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default BlobCursor;
