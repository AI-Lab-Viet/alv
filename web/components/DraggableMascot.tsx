"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import projectMainImage from "@/public/images/mascot/project_main.png";

interface DraggableMascotProps {
    width?: number;
    height?: number;
    initialPosition?: { x: number; y: number };
    containerRef?: React.RefObject<HTMLElement>;
    className?: string;
    onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function DraggableMascot({
    width = 120,
    height = 120,
    initialPosition = { x: 20, y: 20 },
    containerRef,
    className = "",
    onPositionChange,
}: DraggableMascotProps) {
    const [position, setPosition] = useState(initialPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const mascotRef = useRef<HTMLDivElement>(null);

    // Update position when initialPosition changes
    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    // Handle mouse down on mascot
    const handleMouseDown = (e: React.MouseEvent) => {
        // Use window as the container for page-level dragging
        const container = containerRef?.current || document.documentElement;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left - position.x;
        const y = e.clientY - rect.top - position.y;

        dragOffsetRef.current = { x, y };
        setIsDragging(true);
        console.log('Mascot drag started');
        e.preventDefault();

        // Add global mouse event listeners
        const handleGlobalMouseMove = (e: MouseEvent) => {
            const container = containerRef?.current || document.documentElement;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const newX = Math.max(0, Math.min(e.clientX - rect.left - dragOffsetRef.current.x, rect.width - width));
            const newY = Math.max(0, Math.min(e.clientY - rect.top - dragOffsetRef.current.y, rect.height - height));

            const newPosition = { x: newX, y: newY };
            console.log('Mascot position:', newPosition);
            setPosition(newPosition);
            onPositionChange?.(newPosition);
        };

        const handleGlobalMouseUp = () => {
            console.log('Mascot drag ended');
            setIsDragging(false);
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            document.removeEventListener('mouseup', handleGlobalMouseUp);
        };

        document.addEventListener('mousemove', handleGlobalMouseMove);
        document.addEventListener('mouseup', handleGlobalMouseUp);
    };


    return (
        <div
            ref={mascotRef}
            className={`absolute z-50 cursor-move select-none border-2 border-red-500 ${className}`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                width: `${width}px`,
                height: `${height}px`,
            }}
            onMouseDown={handleMouseDown}
            onClick={() => console.log('Mascot clicked')}
        >
            <Image
                src={projectMainImage}
                alt="Project Mascot"
                width={width}
                height={height}
                className={`w-full h-full object-contain transition-transform duration-200 hover:scale-105 ${isDragging ? 'scale-110' : ''
                    }`}
                style={{
                    cursor: isDragging ? 'grabbing' : 'grab',
                }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />

            {/* Optional: Add a subtle shadow/border when dragging */}
            {isDragging && (
                <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-lg pointer-events-none" />
            )}
        </div>
    );
}
