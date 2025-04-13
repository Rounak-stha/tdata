import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const WorkflowSection = () => {
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <section id="workflow" className="landing-section relative bg-gradient-to-b from-background to-black/70 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[linear-gradient(60deg,#2563EB_0%,#2563EB10_100%)] opacity-5"></div>
      <div className="landing-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">Your Project, your way</h2>
            <p className="text-muted-foreground mb-6">
              Tdata adapts to how your team actually works, with customizable project, statuses, and flows to fit your team&apos;s needs.
            </p>
            <motion.ul className="space-y-4 mb-8" variants={listVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}>
              <motion.li variants={listItemVariants} className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1">
                  <ArrowRight size={14} className="text-primary" />
                </div>
                <p>Create custom statuses that match your unique development flow</p>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1">
                  <ArrowRight size={14} className="text-primary" />
                </div>
                <p>Drag and drop tasks as they progress to keep everyone in sync</p>
              </motion.li>
              <motion.li variants={listItemVariants} className="flex items-start">
                <div className="mr-3 mt-1 bg-primary/20 rounded-full p-1">
                  <ArrowRight size={14} className="text-primary" />
                </div>
                <p>Switch between board, list, and timeline views with a single click</p>
              </motion.li>
            </motion.ul>
            <Button className="bg-primary hover:bg-primary/90 text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">See how it works</Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
            className="rounded-xl overflow-hidden border shadow-xl relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <img src="/create-project.png" alt="Tdata workflow board" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;
