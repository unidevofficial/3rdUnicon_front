"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useState, useEffect } from "react"

export function DesignSystem() {
  const [sliderValue, setSliderValue] = useState([50])
  const [stars, setStars] = useState<Array<{ id: number; left: string; top: string; size: string; delay: string }>>([])

  useEffect(() => {
    const generateStars = () => {
      const starArray = []
      for (let i = 0; i < 50; i++) {
        starArray.push({
          id: i,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          size: `${Math.random() * 3 + 1}px`,
          delay: `${Math.random() * 3}s`,
        })
      }
      setStars(starArray)
    }
    generateStars()
  }, [])

  const colorPalette = [
    { name: "Main", hex: "#0B1038", class: "bg-[#0B1038]", description: "Deep space navy - primary brand" },
    { name: "Sub", hex: "#555FFF", class: "bg-[#555FFF]", description: "Cosmic blue - interactive elements" },
    { name: "Highlight", hex: "#A9D7FF", class: "bg-[#A9D7FF]", description: "Nebula blue - highlights & accents" },
    { name: "Point", hex: "#FFD47A", class: "bg-[#FFD47A]", description: "Stellar gold - special moments" },
  ]

  const typographyScale = [
    { name: "Display", class: "text-6xl font-bold", text: "Display Text" },
    { name: "Heading 1", class: "text-4xl font-bold", text: "Heading 1" },
    { name: "Heading 2", class: "text-3xl font-semibold", text: "Heading 2" },
    { name: "Heading 3", class: "text-2xl font-semibold", text: "Heading 3" },
    { name: "Heading 4", class: "text-xl font-medium", text: "Heading 4" },
    { name: "Body Large", class: "text-lg", text: "Body Large Text" },
    { name: "Body", class: "text-base", text: "Body Text" },
    { name: "Body Small", class: "text-sm", text: "Body Small Text" },
    { name: "Caption", class: "text-xs text-muted-foreground", text: "Caption Text" },
  ]

  const spacingScale = [
    { name: "xs", value: "4px", class: "w-1 h-4" },
    { name: "sm", value: "8px", class: "w-2 h-4" },
    { name: "md", value: "16px", class: "w-4 h-4" },
    { name: "lg", value: "24px", class: "w-6 h-4" },
    { name: "xl", value: "32px", class: "w-8 h-4" },
    { name: "2xl", value: "48px", class: "w-12 h-4" },
    { name: "3xl", value: "64px", class: "w-16 h-4" },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        {/* Floating planets */}
        <div className="planet planet-1" />
        <div className="planet planet-2" />
        <div className="planet planet-3" />

        {/* Twinkling stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto p-6 space-y-12">
        <div className="text-center space-y-6 floating-element">
          <div className="relative">
            <h1 className="text-7xl font-bold text-white mb-4 text-balance">
              <span className="bg-gradient-to-r from-[#A9D7FF] via-[#555FFF] to-[#FFD47A] bg-clip-text text-transparent">
                Cosmic Design System
              </span>
            </h1>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#FFD47A] rounded-full animate-pulse opacity-60" />
            <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-[#A9D7FF] rounded-full animate-pulse opacity-40" />
          </div>
          <p className="text-xl text-[#A9D7FF] max-w-3xl mx-auto text-pretty leading-relaxed">
            Journey through the cosmos with our stellar design system, crafted from the depths of space with celestial
            colors and cosmic harmony
          </p>
          <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-sm rounded-full px-6 py-3 border border-white/10">
            <div className="w-3 h-3 bg-[#FFD47A] rounded-full animate-pulse" />
            <span className="text-white font-medium">Design System Active</span>
          </div>
        </div>

        <section className="space-y-8 floating-element">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white mb-2">Stellar Color Palette</h2>
            <p className="text-[#A9D7FF] text-lg">Colors harvested from distant galaxies and cosmic phenomena</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {colorPalette.map((color, index) => (
              <Card
                key={color.name}
                className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className={`${color.class} h-40 w-full relative`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className="absolute top-3 right-3 w-6 h-6 bg-white/20 rounded-full animate-pulse"
                    style={{ animationDelay: `${index * 0.5}s` }}
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-white">{color.name}</CardTitle>
                  <CardDescription className="font-mono text-[#A9D7FF] text-base font-medium">
                    {color.hex}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-white/70">{color.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10 floating-element">
              <CardHeader>
                <CardTitle className="text-white text-xl">Cosmic Actions</CardTitle>
                <CardDescription className="text-[#A9D7FF]">
                  Primary interactions powered by stellar energy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full bg-[#555FFF] hover:bg-[#555FFF]/80 text-white font-medium">
                  Launch Mission
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#A9D7FF] text-[#A9D7FF] hover:bg-[#A9D7FF]/10"
                >
                  Explore Galaxy
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10 floating-element">
              <CardHeader>
                <CardTitle className="text-white text-xl">Stellar Highlights</CardTitle>
                <CardDescription className="text-[#A9D7FF]">
                  Accent elements that shine like distant stars
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Badge className="bg-[#FFD47A] text-[#0B1038] hover:bg-[#FFD47A]/80 font-medium">⭐ Featured</Badge>
                  <Badge className="bg-[#A9D7FF] text-[#0B1038] hover:bg-[#A9D7FF]/80 font-medium">🌟 New</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-white/70">
                    <span>Mission Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} className="w-full h-3 bg-white/10" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="bg-white/20" />

        <section className="space-y-8 floating-element">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white mb-2">Galactic Typography</h2>
            <p className="text-[#A9D7FF] text-lg">Text hierarchy inspired by cosmic scales</p>
          </div>

          <Card className="bg-white/5 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 space-y-8">
              {[
                { name: "Supernova", class: "text-6xl font-bold text-white", text: "Supernova Display" },
                { name: "Galaxy", class: "text-4xl font-bold text-white", text: "Galaxy Heading" },
                { name: "Nebula", class: "text-3xl font-semibold text-white", text: "Nebula Title" },
                { name: "Star", class: "text-2xl font-semibold text-[#A9D7FF]", text: "Star Subtitle" },
                { name: "Planet", class: "text-xl font-medium text-[#A9D7FF]", text: "Planet Header" },
                { name: "Asteroid", class: "text-lg text-white", text: "Asteroid Body Large" },
                { name: "Comet", class: "text-base text-white/90", text: "Comet Body Text" },
                { name: "Dust", class: "text-sm text-white/70", text: "Cosmic Dust Small" },
                { name: "Particle", class: "text-xs text-white/50", text: "Space Particle Caption" },
              ].map((type) => (
                <div key={type.name} className="flex items-baseline gap-8">
                  <div className="w-24 text-sm text-[#FFD47A] font-medium">{type.name}</div>
                  <div className={type.class}>{type.text}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Separator className="bg-white/20" />

        <section className="space-y-8 floating-element">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white mb-2">Cosmic Components</h2>
            <p className="text-[#A9D7FF] text-lg">UI elements forged in the heart of stars</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Mission Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-[#555FFF] hover:bg-[#555FFF]/80">Primary Mission</Button>
                <Button variant="secondary" className="w-full bg-white/10 text-white hover:bg-white/20">
                  Secondary Task
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent border-[#A9D7FF] text-[#A9D7FF] hover:bg-[#A9D7FF]/10"
                >
                  Explore
                </Button>
                <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10">
                  Ghost Signal
                </Button>
              </CardContent>
            </Card>

            {/* Form Elements */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Communication Hub</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Enter coordinates..."
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
                <Textarea
                  placeholder="Mission log..."
                  rows={3}
                  className="bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
                <div className="flex items-center space-x-2">
                  <Switch id="cosmic-mode" />
                  <label htmlFor="cosmic-mode" className="text-sm text-white">
                    Cosmic Mode
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Elements */}
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-white">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A9D7FF]">Energy Level</label>
                  <Slider value={sliderValue} onValueChange={setSliderValue} max={100} step={1} className="w-full" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#A9D7FF]">Mission Progress</label>
                  <Progress value={sliderValue[0]} className="w-full h-3 bg-white/10" />
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8 floating-element">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white mb-2">Cosmic Guidelines</h2>
            <p className="text-[#A9D7FF] text-lg">Universal laws for stellar design implementation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-[#A9D7FF] flex items-center gap-2">
                  <span className="text-2xl">✨</span> Stellar Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/80">
                <p>• Use Main (#0B1038) as the cosmic foundation</p>
                <p>• Deploy Sub (#555FFF) for primary stellar actions</p>
                <p>• Apply Highlight (#A9D7FF) for nebula-like accents</p>
                <p>• Reserve Point (#FFD47A) for rare cosmic events</p>
                <p>• Maintain cosmic harmony with consistent spacing</p>
                <p>• Follow galactic hierarchy for all communications</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center gap-2">
                  <span className="text-2xl">🚫</span> Cosmic Violations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-white/80">
                <p>• Never mix alien colors outside our galaxy</p>
                <p>• Avoid using Point color for vast cosmic areas</p>
                <p>• Don't create rogue spacing outside our system</p>
                <p>• Never exceed 3 colors in a single constellation</p>
                <p>• Don't disrupt the cosmic typography order</p>
                <p>• Always maintain stellar accessibility standards</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <div className="text-center py-12 floating-element">
          <div className="inline-flex items-center gap-4 text-[#A9D7FF]">
            <div className="w-2 h-2 bg-[#FFD47A] rounded-full animate-pulse" />
            <span className="text-sm">Design System v1.0 • Crafted in the Cosmos</span>
            <div className="w-2 h-2 bg-[#A9D7FF] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
