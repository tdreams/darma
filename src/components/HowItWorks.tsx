import { steps } from "@/utils/howItWorksContent";
import { motion } from "framer-motion";
import { useState } from "react";

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section
      id="how-it-works"
      className="py-24 bg-gradient-to-br from-white via-blue-50 to-white 
      min-h-screen flex items-center justify-center"
    >
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="text-center mb-16"
        >
          <h2
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent 
            bg-gradient-to-r from-blue-600 to-purple-600 mb-4"
          >
            Journey of Returns
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            A holistic approach to simplifying your package returns
          </p>
        </motion.div>

        {/* Circular Layout */}
        <div className="relative mx-auto w-full max-w-[600px] aspect-square">
          {/* Central Hub */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-48 md:w-64 h-48 md:h-64 bg-gradient-to-br from-blue-500 to-purple-600 
              rounded-full shadow-lg relative"
            >
              {/* Render Steps' Icons Around the Circle */}
              {steps.map((step, index) => {
                const totalSteps = steps.length;
                const angle = (360 / totalSteps) * index; // Divide the circle evenly
                const radius = 140; // Distance from the center

                // Place the icons in a circular layout
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.2 }}
                    style={{
                      position: "absolute",
                      top: `calc(50% + ${
                        Math.sin((angle * Math.PI) / 180) * radius
                      }px)`,
                      left: `calc(50% + ${
                        Math.cos((angle * Math.PI) / 180) * radius
                      }px)`,
                      transform: `translate(-50%, -50%)`,
                    }}
                    className="flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white 
                    rounded-full shadow-lg transition-transform hover:scale-110"
                    onClick={() => setActiveStep(index)}
                  >
                    <div
                      className="w-12 h-12 md:w-16 md:h-16 
                      bg-gradient-to-br from-blue-500 to-purple-600 
                      rounded-full flex items-center justify-center"
                    >
                      <step.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                  </motion.div>
                );
              })}

              {/* Central Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full shadow-inner">
                <span
                  className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent 
                  bg-gradient-to-r from-blue-600 to-purple-600"
                >
                  Returns
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Active Step Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeStep}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-blue-800">
            {steps[activeStep]?.title}
          </h3>
          <p className="text-gray-600 text-lg mt-2 max-w-xl mx-auto">
            {steps[activeStep]?.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
