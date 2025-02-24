// components/Hero.tsx
import { motion } from "framer-motion";
import { ArrowRight, Package, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { heroContent } from "@/utils/heroContents";
import { trpc } from "@/lib/trpc";
import { formatCompactNumber } from "@/utils/formatCompactNumber";

const MotionLink = motion(Link);

export default function Hero() {
  const {
    data: globalStats,
    isLoading,
    isError,
  } = trpc.getGlobalStats.useQuery();

  return (
    <section
      id="hero"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800"
    >
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gentle Gradient Animation */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10"
          animate={{
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{
              scale: 0,
              opacity: 0,
              x: Math.random() * 100,
              y: Math.random() * 100,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.3, 0],
              x: ["0%", `${Math.random() * 100}%`, "0%"],
              y: ["0%", `${Math.random() * 100}%`, "0%"],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Soft Light Pulse */}
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-white/5 to-transparent"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
          }}
        />
      </div>

      {/* Subtle Grid Texture */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />

      <div className="container relative mx-auto px-6 md:px-12 lg:px-24 py-12 md:py-20 lg:py-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Logo Container */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="mx-auto mb-8 relative"
          >
            <div className="absolute inset-0 bg-white/10 rounded-full blur-lg transform scale-110" />
            <div className="relative flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/20">
              <Package className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          {/* Heading */}
          <div className="space-y-4 mb-6">
            {heroContent.heading.map((line, index) => (
              <motion.h1
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="text-3xl md:text-4xl lg:text-6xl font-bold tracking-tighter text-white"
              >
                {line}
              </motion.h1>
            ))}
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-auto mb-8 max-w-2xl text-sm md:text-base text-blue-100/90 leading-relaxed"
          >
            {heroContent.description}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MotionLink
              to={heroContent.button.link}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="group relative overflow-hidden bg-white text-blue-600 hover:bg-blue-50 shadow-lg shadow-blue-500/20"
              >
                <span className="relative flex items-center gap-2">
                  {heroContent.button.text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </MotionLink>

            <MotionLink
              to={heroContent.button2.link}
              onClick={() => {
                const featuresEl = document.getElementById("features");
                if (featuresEl) {
                  featuresEl.scrollIntoView({ behavior: "smooth" });
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-transparent border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                {heroContent.button2.text}
                <ArrowDown className="h-4 w-4 ml-2 transition-transform group-hover:translate-y-1" />
              </Button>
            </MotionLink>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
          >
            {isLoading || isError || !globalStats ? (
              // Skeleton Loaders
              [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10"
                >
                  <div className="h-7 bg-white/20 rounded mb-2 w-3/4 mx-auto" />
                  <div className="h-4 bg-white/10 rounded w-1/2 mx-auto" />
                </div>
              ))
            ) : (
              <>
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatCompactNumber(globalStats.userCount)}
                  </div>
                  <div className="text-sm text-blue-100/80">Trusted Users</div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">
                    {formatCompactNumber(globalStats.returnsCount)}
                  </div>
                  <div className="text-sm text-blue-100/80">
                    Successful Returns
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-bold text-white mb-1">
                    99.9%
                  </div>
                  <div className="text-sm text-blue-100/80">
                    Satisfaction Rate
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Bottom Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-blue-800/50 to-transparent" />
    </section>
  );
}
