import React, { useRef, useState, useEffect } from 'react';
import { Palette, Eraser, Download, Trash2, Brush } from 'lucide-react';

const PaintingSheet = () => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#ff0000');
    const [brushSize, setBrushSize] = useState(8);
    const [isEraser, setIsEraser] = useState(false);

    const colors = [
        '#ff0000', '#ff9900', '#ffff00', '#33cc33', '#0099ff',
        '#cc33cc', '#000000', '#ffffff', '#8b4513', '#ffb6c1'
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = 500 * dpr;

            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);

            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, rect.width, 500);

            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            const handleResize = () => {
                // To prevent losing drawing, we could save image data but for a simple kids sheet 
                // we'll just let it be. Let's just make sure it initializes correctly on first load.
            };
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
        setIsDrawing(true);
        // Important for touch: prevent scrolling
        if (e.cancelable) e.preventDefault();
    };

    const draw = (e) => {
        if (!isDrawing) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();

        let clientX = e.clientX;
        let clientY = e.clientY;

        if (e.touches && e.touches.length > 0) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        }

        ctx.strokeStyle = isEraser ? '#ffffff' : color;
        ctx.lineWidth = brushSize;
        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();

        if (e.cancelable) e.preventDefault();
    };

    const stopDrawing = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.closePath();
        }
        setIsDrawing(false);
    };

    const clearCanvas = () => {
        if (window.confirm('Are you sure you want to clear the canvas?')) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
        }
    };

    const downloadCanvas = () => {
        const canvas = canvasRef.current;
        // White background explicitly needed for transparent images when saving?
        // It's already filled white so it's fine.
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `kids-painting-${new Date().getTime()}.png`;
        link.href = dataUrl;
        link.click();
    };

    return (
        <div className="page-content fade-in painting-sheet-container">
            <div className="page-header">
                <h1 className="page-title">Kids Interactive Painting Sheet</h1>
                <p className="page-subtitle">Pick a color and start drawing! Works on touch devices.</p>
            </div>

            <div className="painting-controls glass-panel" style={{ padding: '16px', marginBottom: '20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>

                <div className="tool-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <button
                        className={`action-btn ${!isEraser ? 'active' : ''}`}
                        onClick={() => setIsEraser(false)}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            background: !isEraser ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Paint Brush"
                    >
                        <Brush size={24} color={!isEraser ? '#fff' : 'var(--text-primary)'} />
                    </button>
                    <button
                        className={`action-btn ${isEraser ? 'active' : ''}`}
                        onClick={() => setIsEraser(true)}
                        style={{
                            padding: '10px',
                            borderRadius: '12px',
                            background: isEraser ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        title="Eraser"
                    >
                        <Eraser size={24} color={isEraser ? '#fff' : 'var(--text-primary)'} />
                    </button>
                </div>

                <div className="color-picker-group" style={{ display: 'flex', gap: '8px', padding: '0 16px', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    {colors.map((c) => (
                        <button
                            key={c}
                            onClick={() => { setColor(c); setIsEraser(false); }}
                            style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '50%',
                                backgroundColor: c,
                                border: color === c && !isEraser ? '3px solid white' : '2px solid rgba(0,0,0,0.2)',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: color === c && !isEraser ? 'scale(1.1)' : 'scale(1)',
                                boxShadow: color === c && !isEraser ? '0 0 10px rgba(255,255,255,0.3)' : 'none'
                            }}
                            title={`Pick Color ${c}`}
                        />
                    ))}
                    {/* Native color picker for more options */}
                    <div style={{ position: 'relative', width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.2)' }}>
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => { setColor(e.target.value); setIsEraser(false); }}
                            style={{ position: 'absolute', top: '-10px', left: '-10px', width: '56px', height: '56px', cursor: 'pointer', border: 'none' }}
                            title="Custom Color"
                        />
                    </div>
                </div>

                <div className="brush-size-group" style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '200px' }}>
                    <Palette size={20} color="var(--text-muted)" />
                    <input
                        type="range"
                        min="2"
                        max="60"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        style={{ flex: 1, accentColor: 'var(--primary-color)', cursor: 'pointer' }}
                    />
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}
                        title={`Size: ${brushSize}px`}
                    >
                        <div
                            style={{
                                width: `${Math.min(brushSize, 32)}px`,
                                height: `${Math.min(brushSize, 32)}px`,
                                borderRadius: '50%',
                                backgroundColor: isEraser ? '#999' : color
                            }}
                        />
                    </div>
                </div>

                <div className="actions-group" style={{ display: 'flex', gap: '10px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
                    <button
                        onClick={clearCanvas}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'rgba(255,50,50,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,50,50,0.2)', cursor: 'pointer', fontWeight: 500 }}
                    >
                        <Trash2 size={18} /> Clear
                    </button>
                    <button
                        onClick={downloadCanvas}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '12px', background: 'var(--primary-color)', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 500, boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)' }}
                    >
                        <Download size={18} /> Save Art
                    </button>
                </div>

            </div>

            <div
                className="canvas-wrapper glass-panel"
                style={{
                    padding: '0',
                    overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    touchAction: 'none', // Crucial: disables browser touch actions like scrolling
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
            >
                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseOut={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '500px',
                        cursor: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='${encodeURIComponent(isEraser ? '#000000' : color)}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='4'></circle></svg>") 12 12, crosshair`
                    }}
                />
            </div>
        </div>
    );
};

export default PaintingSheet;
