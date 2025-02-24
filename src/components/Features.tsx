import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import {
  container,
  features,
  featuresContent,
  imageCar,
  item,
} from "@/utils/featuresContent";

export default function Features() {
  return (
    <section
      id="features"
      className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden 
      bg-gradient-to-br from-blue-600 to-blue-800 py-24"
    >
      {/* Particle Background */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-extrabold text-white mb-4">
            {featuresContent.title}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {featuresContent.text}
          </p>
        </motion.div>

        {/* Enhanced Feature Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="perspective-1000 hover:z-10"
            >
              <Card
                className="relative overflow-hidden group hover:shadow-2xl 
                transition-all duration-300 transform hover:-translate-y-4 
                border-2 border-blue-200/20 bg-white/5 backdrop-blur-lg
                hover:border-blue-300/30"
              >
                <div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <CardContent className="p-8 relative z-10">
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    className="mb-6 inline-flex h-16 w-16 items-center justify-center 
                    rounded-xl bg-white/10 backdrop-blur-sm group-hover:bg-blue-600 
                    transition-all duration-300 shadow-lg"
                  >
                    <feature.icon
                      className="h-8 w-8 text-white group-hover:scale-110 
                      transition-all duration-300"
                    />
                  </motion.div>

                  <h3 className="text-2xl font-bold mb-3 text-white">
                    {feature.title}
                  </h3>

                  <p className="text-blue-100 mb-4">{feature.description}</p>

                  {feature.points && feature.points.length > 0 && (
                    <ul className="space-y-2">
                      {feature.points.map((point: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-center text-blue-100/90 group-hover:text-white/90"
                        >
                          <svg
                            className="w-4 h-4 mr-2 text-blue-300 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}

                  <motion.div
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    className="h-0.5 bg-white/30 mt-6 origin-left"
                  />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-20"
        >
          <div
            className="inline-block bg-gradient-to-br from-white/10 to-blue-500/20 
            backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready for Stress-Free Returns?
            </h3>
            <p className="text-blue-100 mb-6 max-w-lg mx-auto">
              Join thousands of satisfied customers enjoying our seamless return
              process
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/schedule-return"
                className="px-6 py-3 bg-white text-blue-600 font-semibold 
                rounded-lg hover:bg-blue-50 transition-all duration-300 
                shadow-lg hover:shadow-xl"
              >
                Start Now
              </a>
              {/* <a
                href="/demo"
                className="px-6 py-3 border-2 border-white/30 text-white 
                font-semibold rounded-lg hover:border-white/50 hover:bg-white/10 
                transition-all duration-300"
              >
                Watch Demo
              </a> */}
            </div>
          </div>
        </motion.div>

        {/* Animated Delivery Car */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
          className="hidden lg:block absolute -bottom-20 right-24 z-10 pointer-events-none"
        >
          <motion.img
            src={imageCar.illustration}
            alt="Delivery Car Illustration"
            className="w-48 xl:w-64"
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
