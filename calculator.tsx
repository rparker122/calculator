"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Plus, Minus, X, Divide, Percent, RotateCcw, Delete } from "lucide-react"

export default function Calculator() {
  const [input, setInput] = useState<string>("0")
  const [result, setResult] = useState<string | null>(null)
  const [memory, setMemory] = useState<number>(0)
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState<boolean>(false)

  // Handle number input
  const handleNumberInput = (num: string) => {
    setInput((prev) => {
      if (prev === "0") {
        return num
      } else {
        return prev + num
      }
    })
  }

  // Handle operator input
  const handleOperatorInput = (operator: string) => {
    setInput((prev) => {
      // Avoid consecutive operators
      const lastChar = prev.slice(-1)
      if (["+", "-", "*", "/", "."].includes(lastChar)) {
        return prev.slice(0, -1) + operator
      }
      return prev + operator
    })
  }

  // Calculate result
  const calculateResult = () => {
    try {
      // Replace × with * and ÷ with / for evaluation
      const sanitizedInput = input.replace(/×/g, "*").replace(/÷/g, "/")

      // Use Function constructor to safely evaluate the expression
      const result = new Function(`return ${sanitizedInput}`)()

      // Format the result
      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "")

      setResult(formattedResult)
      setHistory((prev) => [...prev, `${input} = ${formattedResult}`])
      setInput(formattedResult)
    } catch (error) {
      setResult("Error")
      setInput("0")
    }
  }

  // Clear input
  const clearInput = () => {
    setInput("0")
    setResult(null)
  }

  // Delete last character
  const deleteLastChar = () => {
    setInput((prev) => {
      if (prev.length === 1) {
        return "0"
      } else {
        return prev.slice(0, -1)
      }
    })
  }

  // Handle special functions
  const handleSpecialFunction = (func: string) => {
    try {
      const value = Number.parseFloat(input)
      let result: number

      switch (func) {
        case "sin":
          result = Math.sin(value)
          break
        case "cos":
          result = Math.cos(value)
          break
        case "tan":
          result = Math.tan(value)
          break
        case "log":
          result = Math.log10(value)
          break
        case "ln":
          result = Math.log(value)
          break
        case "sqrt":
          result = Math.sqrt(value)
          break
        case "square":
          result = value * value
          break
        default:
          return
      }

      const formattedResult = Number.isInteger(result) ? result.toString() : result.toFixed(8).replace(/\.?0+$/, "")

      setResult(formattedResult)
      setHistory((prev) => [...prev, `${func}(${input}) = ${formattedResult}`])
      setInput(formattedResult)
    } catch (error) {
      setResult("Error")
      setInput("0")
    }
  }

  // Memory functions
  const handleMemory = (action: string) => {
    switch (action) {
      case "M+":
        setMemory((prev) => prev + Number.parseFloat(input))
        break
      case "M-":
        setMemory((prev) => prev - Number.parseFloat(input))
        break
      case "MR":
        setInput(memory.toString())
        break
      case "MC":
        setMemory(0)
        break
      default:
        return
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Animated Galaxy Background */}
      <GalaxyBackground />

      <div className="relative z-10 mx-auto flex h-full max-w-md flex-col items-center justify-center p-4">
        <div
          className="w-full max-w-md overflow-hidden bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-lg"
          style={{
            borderRadius: "30px 30px 80px 30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -1px 1px rgba(0,0,0,0.2), 0 0 20px rgba(88, 101, 242, 0.3)",
            border: "1px solid rgba(88, 101, 242, 0.2)",
          }}
        >
          {/* Calculator Display */}
          <div className="relative p-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="absolute right-4 top-4 text-xs text-indigo-400 hover:text-white"
            >
              {showHistory ? "Hide History" : "Show History"}
            </button>

            {showHistory ? (
              <div className="mb-4 h-32 overflow-y-auto rounded bg-black/40 p-2 text-right">
                {history.length === 0 ? (
                  <p className="text-gray-500">No history yet</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className="mb-1 text-sm text-indigo-300">
                      {item}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="mb-4 h-32 rounded bg-black/40 p-4">
                <div className="mb-2 h-6 overflow-x-auto text-right text-lg text-indigo-400">
                  {result && `${input} =`}
                </div>
                <div className="h-16 overflow-x-auto text-right text-4xl font-light">{input}</div>
              </div>
            )}

            {/* Memory Display */}
            <div className="mb-2 text-right text-xs text-indigo-400">{memory !== 0 && `Memory: ${memory}`}</div>
          </div>

          {/* Calculator Buttons */}
          <div
            className="grid grid-cols-4 gap-2 p-4"
            style={{
              clipPath: "polygon(0% 0%, 100% 0%, 100% 90%, 85% 100%, 0% 100%)",
            }}
          >
            {/* Memory Row */}
            <button
              onClick={() => handleMemory("MC")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              MC
            </button>
            <button
              onClick={() => handleMemory("MR")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              MR
            </button>
            <button
              onClick={() => handleMemory("M+")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              M+
            </button>
            <button
              onClick={() => handleMemory("M-")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              M-
            </button>

            {/* Scientific Functions */}
            <button
              onClick={() => handleSpecialFunction("sin")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              sin
            </button>
            <button
              onClick={() => handleSpecialFunction("cos")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              cos
            </button>
            <button
              onClick={() => handleSpecialFunction("tan")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              tan
            </button>
            <button
              onClick={() => handleSpecialFunction("log")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              log
            </button>

            <button
              onClick={() => handleSpecialFunction("ln")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              ln
            </button>
            <button
              onClick={() => handleSpecialFunction("sqrt")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              √
            </button>
            <button
              onClick={() => handleSpecialFunction("square")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              x²
            </button>
            <button
              onClick={() => handleOperatorInput("%")}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <Percent size={18} />
            </button>

            {/* Clear and Delete */}
            <button
              onClick={clearInput}
              className="flex items-center justify-center rounded-lg bg-gradient-to-r from-red-900/80 to-purple-900/80 p-3 hover:from-red-800 hover:to-purple-800 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-900/30"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={deleteLastChar}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <Delete size={18} />
            </button>
            <button
              onClick={() => handleOperatorInput("(")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              (
            </button>
            <button
              onClick={() => handleOperatorInput(")")}
              className="rounded-lg bg-indigo-900/30 p-3 text-sm hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              )
            </button>

            {/* Numbers and Operations */}
            <button
              onClick={() => handleNumberInput("7")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              7
            </button>
            <button
              onClick={() => handleNumberInput("8")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              8
            </button>
            <button
              onClick={() => handleNumberInput("9")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              9
            </button>
            <button
              onClick={() => handleOperatorInput("/")}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <Divide size={18} />
            </button>

            <button
              onClick={() => handleNumberInput("4")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              4
            </button>
            <button
              onClick={() => handleNumberInput("5")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              5
            </button>
            <button
              onClick={() => handleNumberInput("6")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              6
            </button>
            <button
              onClick={() => handleOperatorInput("*")}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <X size={18} />
            </button>

            <button
              onClick={() => handleNumberInput("1")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              1
            </button>
            <button
              onClick={() => handleNumberInput("2")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              2
            </button>
            <button
              onClick={() => handleNumberInput("3")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              3
            </button>
            <button
              onClick={() => handleOperatorInput("-")}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <Minus size={18} />
            </button>

            <button
              onClick={() => handleNumberInput("0")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              0
            </button>
            <button
              onClick={() => handleOperatorInput(".")}
              className="rounded-lg bg-indigo-800/30 p-3 hover:bg-indigo-700/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              .
            </button>
            <button
              onClick={calculateResult}
              className="rounded-lg bg-gradient-to-r from-blue-600/80 to-purple-600/80 p-3 hover:from-blue-500 hover:to-purple-500 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-600/30"
            >
              =
            </button>
            <button
              onClick={() => handleOperatorInput("+")}
              className="flex items-center justify-center rounded-lg bg-indigo-900/30 p-3 hover:bg-indigo-800/50 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-indigo-900/30"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Galaxy Background Component with Canvas
function GalaxyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Star class
    class Star {
      x: number
      y: number
      radius: number
      color: string
      dx: number
      dy: number
      brightness: number
      maxBrightness: number
      twinkleSpeed: number
      twinkleDirection: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = Math.random() * 1.5

        // Star colors - mostly white/blue with occasional other colors
        const colors = [
          "#ffffff",
          "#ffffff",
          "#ffffff",
          "#ffffff", // More whites for realism
          "#8be9fd",
          "#bd93f9",
          "#ff79c6",
          "#f1fa8c", // Occasional colored stars
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]

        // Very slow movement to simulate parallax
        this.dx = (Math.random() - 0.5) * 0.05
        this.dy = (Math.random() - 0.5) * 0.05

        // Twinkling effect
        this.brightness = Math.random()
        this.maxBrightness = 0.7 + Math.random() * 0.3
        this.twinkleSpeed = 0.001 + Math.random() * 0.005
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1
      }

      draw() {
        if (!ctx) return

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.globalAlpha = this.brightness
        ctx.fill()
        ctx.globalAlpha = 1
      }

      update() {
        // Move star
        this.x += this.dx
        this.y += this.dy

        // Wrap around edges
        if (this.x < 0) this.x = canvas.width
        if (this.x > canvas.width) this.x = 0
        if (this.y < 0) this.y = canvas.height
        if (this.y > canvas.height) this.y = 0

        // Twinkle effect
        this.brightness += this.twinkleSpeed * this.twinkleDirection
        if (this.brightness > this.maxBrightness || this.brightness < 0.1) {
          this.twinkleDirection *= -1
        }

        this.draw()
      }
    }

    // Cosmic Ray class
    class CosmicRay {
      x: number
      y: number
      length: number
      angle: number
      speed: number
      width: number
      color: string
      life: number
      maxLife: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.length = 100 + Math.random() * 200
        this.angle = Math.random() * Math.PI * 2
        this.speed = 1 + Math.random() * 3
        this.width = 0.5 + Math.random() * 2

        // Ray colors
        const colors = [
          "rgba(189, 147, 249, 0.3)", // Purple
          "rgba(80, 250, 123, 0.3)", // Green
          "rgba(139, 233, 253, 0.3)", // Cyan
          "rgba(255, 121, 198, 0.3)", // Pink
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]

        this.life = 0
        this.maxLife = 100 + Math.random() * 100
      }

      draw() {
        if (!ctx) return

        const startX = this.x
        const startY = this.y
        const endX = this.x + Math.cos(this.angle) * this.length
        const endY = this.y + Math.sin(this.angle) * this.length

        // Create gradient for the ray
        const gradient = ctx.createLinearGradient(startX, startY, endX, endY)
        gradient.addColorStop(0, this.color.replace("0.3", "0"))
        gradient.addColorStop(0.5, this.color)
        gradient.addColorStop(1, this.color.replace("0.3", "0"))

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = gradient
        ctx.lineWidth = this.width
        ctx.globalAlpha = Math.min(1, (this.maxLife - this.life) / this.maxLife)
        ctx.stroke()
        ctx.globalAlpha = 1
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed
        this.y += Math.sin(this.angle) * this.speed
        this.life++

        this.draw()

        // Return true if the ray should be removed
        return (
          this.life > this.maxLife ||
          this.x < -this.length ||
          this.x > canvas.width + this.length ||
          this.y < -this.length ||
          this.y > canvas.height + this.length
        )
      }
    }

    // Nebula class
    class Nebula {
      x: number
      y: number
      radius: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.radius = 50 + Math.random() * 150

        // Nebula colors
        const colors = [
          "rgba(189, 147, 249, 0.05)", // Purple
          "rgba(80, 250, 123, 0.05)", // Green
          "rgba(139, 233, 253, 0.05)", // Cyan
          "rgba(255, 121, 198, 0.05)", // Pink
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
        this.opacity = 0.05 + Math.random() * 0.1
      }

      draw() {
        if (!ctx) return

        // Create radial gradient for nebula
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius)
        gradient.addColorStop(0, this.color.replace("0.05", String(this.opacity)))
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // Create stars, cosmic rays, and nebulae
    const stars: Star[] = []
    const numStars = Math.floor((canvas.width * canvas.height) / 1000) // Adjust density
    for (let i = 0; i < numStars; i++) {
      stars.push(new Star())
    }

    let cosmicRays: CosmicRay[] = []
    const nebulae: Nebula[] = []

    // Create initial nebulae
    for (let i = 0; i < 5; i++) {
      nebulae.push(new Nebula())
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Clear canvas completely - no trails
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      bgGradient.addColorStop(0, "rgba(0, 0, 0, 1)")
      bgGradient.addColorStop(0.5, "rgba(20, 10, 40, 1)")
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 1)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw nebulae (background)
      nebulae.forEach((nebula) => nebula.draw())

      // Update and draw stars
      stars.forEach((star) => star.update())

      // Randomly add new cosmic rays
      if (Math.random() < 0.03) {
        cosmicRays.push(new CosmicRay())
      }

      // Update and draw cosmic rays, remove dead ones
      cosmicRays = cosmicRays.filter((ray) => !ray.update())

      // Draw galaxy center glow
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.4

      const galaxyGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
      galaxyGradient.addColorStop(0, "rgba(139, 233, 253, 0.1)")
      galaxyGradient.addColorStop(0.5, "rgba(189, 147, 249, 0.05)")
      galaxyGradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = galaxyGradient
      ctx.fill()
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Additional cosmic dust particles with Framer Motion */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`dust-${i}`}
          className="absolute rounded-full"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            scale: Math.random() * 0.5 + 0.1,
            opacity: Math.random() * 0.3 + 0.1,
          }}
          animate={{
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            opacity: [0.1, 0.3, 0.1],
            scale: [Math.random() * 0.3 + 0.1, Math.random() * 0.5 + 0.2, Math.random() * 0.3 + 0.1],
          }}
          transition={{
            duration: 20 + i * 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            width: ((i % 5) + 1) * 15 + "px",
            height: ((i % 5) + 1) * 15 + "px",
            background: `radial-gradient(circle, rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2) 0%, rgba(0,0,0,0) 70%)`,
            boxShadow: `0 0 ${(i % 5) * 5}px rgba(255, 255, 255, 0.3)`,
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Cosmic energy waves */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full"
          style={{
            width: "200%",
            height: "200%",
            left: "-50%",
            top: "-50%",
            background: `radial-gradient(circle, rgba(139, 233, 253, 0) 0%, rgba(139, 233, 253, 0.03) 30%, rgba(189, 147, 249, 0.05) 60%, rgba(0, 0, 0, 0) 70%)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8 + i * 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  )
}

