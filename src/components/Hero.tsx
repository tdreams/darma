import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { heroContnent } from "@/utils/heroContents";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 hero-pattern">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"></div>
      <div className="container relative mx-auto px-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* White circle backgound for the Logo */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm"
          >
            {/*The placeholder logo for now*/}
            <Package className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="mb-6 text-4xl font-bold tracking-tighter text-white sm:text-6xl text-shadow "
          >
            {heroContnent.heading.map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </motion.h1>
          <motion.p
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="mx-auto mb-8 max-w-2xl text-blue-100"
          >
            {heroContnent.description}
          </motion.p>

          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
          >
            <Link to={heroContnent.button.link}>
              <Button
                size="lg"
                className="group relative overflow-hidden bg-white text-blue-600 hover:bg-blue-50"
              >
                <span className="relative flex items-center gap-2">
                  {heroContnent.button.text}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute inset-x-0 -bottom-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-bottom-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-500 to-blue-600 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>
    </section>
  );
}
