import { useEffect, useRef } from 'react'

interface Particle {
    x: number
    y: number
    vx: number
    vy: number
    size: number
}

export default function BackgroundCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        let animationFrameId: number
        let particles: Particle[] = []
        const particleCount = 100
        const connectionDistance = 150
        const mouseDistance = 200

        let mouseX = -1000
        let mouseY = -1000

        const resize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        const initParticles = () => {
            particles = []
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                })
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            // Update and draw particles
            particles.forEach((p, i) => {
                // Move
                p.x += p.vx
                p.y += p.vy

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1

                // Mouse interaction
                const dx = p.x - mouseX
                const dy = p.y - mouseY
                const dist = Math.sqrt(dx * dx + dy * dy)

                if (dist < mouseDistance) {
                    const force = (mouseDistance - dist) / mouseDistance
                    const angle = Math.atan2(dy, dx)
                    p.vx += Math.cos(angle) * force * 0.05
                    p.vy += Math.sin(angle) * force * 0.05
                }

                // Draw particle
                ctx.beginPath()
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
                ctx.fillStyle = `rgba(239, 68, 68, ${0.3 * (p.size / 3)})` // primary red color
                ctx.fill()

                // Draw connections
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j]
                    const pdx = p.x - p2.x
                    const pdy = p.y - p2.y
                    const pDist = Math.sqrt(pdx * pdx + pdy * pdy)

                    if (pDist < connectionDistance) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(239, 68, 68, ${0.1 * (1 - pDist / connectionDistance)})`
                        ctx.lineWidth = 1
                        ctx.moveTo(p.x, p.y)
                        ctx.lineTo(p2.x, p2.y)
                        ctx.stroke()
                    }
                }
            })

            animationFrameId = requestAnimationFrame(animate)
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        window.addEventListener('resize', resize)
        window.addEventListener('mousemove', handleMouseMove)

        resize()
        initParticles()
        animate()

        return () => {
            window.removeEventListener('resize', resize)
            window.removeEventListener('mousemove', handleMouseMove)
            cancelAnimationFrame(animationFrameId)
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none opacity-50"
        />
    )
}
