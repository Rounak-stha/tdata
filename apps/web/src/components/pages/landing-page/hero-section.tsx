import Link from "next/link";

import { Play } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Paths } from "@/lib/constants";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28">
      <div className="landing-container">
        <div className="flex flex-col items-center text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 max-w-4xl leading-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            Project management that adapts to your workflow
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8"
          >
            Tdata gives teams total control through customizable workflows, collaborative task boards, and powerful analytics—designed for your process, not the other way around.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 mb-12 group"
          >
            <Link href={Paths.signin}>
              <Button>Join</Button>
            </Link>
            <Button variant="outline" className="cursor-not-allowed" disabled>
              <Play size={18} className="mr-2" />
              <span className="">Watch Demo</span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            type: "spring",
            stiffness: 100,
          }}
          className="rounded-xl overflow-hidden border shadow-2xl max-w-5xl mx-auto"
        >
          <img src="/project-page.png" alt="Tdata project board" className="w-full h-auto" />
        </motion.div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">Trusted by fast-moving teams at</p>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 1, delay: 0.8 }} className="flex flex-wrap justify-center gap-8">
            <div className="h-8">Acme Inc</div>
            <div className="h-8">Globex</div>
            <div className="h-8">Initech</div>
            <div className="h-8">Umbrella</div>
            <div className="h-8">Stark Industries</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
