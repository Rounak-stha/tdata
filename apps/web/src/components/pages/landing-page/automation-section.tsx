import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const AutomationSection = () => {
  const featureCardVariants = {
    offscreen: {
      opacity: 0,
      y: 20,
    },
    onscreen: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
      },
    }),
  };

  return (
    <section id="collaboration" className="landing-section relative">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-card/30 to-transparent pointer-events-none"></div>
      <div className="landing-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="order-2 lg:order-1 rounded-xl overflow-hidden border shadow-xl relative group"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <img src="/automation.png" alt="Tdata task detail view" className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]" />
          </motion.div>
          <motion.div
            className="order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent">Collaboration without the chaos</h2>
            <p className="text-muted-foreground mb-6">
              Keep discussions, files, and decisions together in context. No more switching between tools or losing important context in endless threads.
            </p>
            <div className="space-y-6 mb-8">
              <motion.div
                custom={0}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-50px" }}
                variants={featureCardVariants}
                className="bg-bg-card border rounded-lg p-6 transition-all duration-300 hover:border-primary border-l-4 border-l-primary relative group overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">Task-based comments</h3>
                <p className="text-muted-foreground text-sm">Add context, tag teammates, and share updates right where the work happens</p>
              </motion.div>
              <motion.div
                custom={1}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-50px" }}
                variants={featureCardVariants}
                className="bg-bg-card border rounded-lg p-6 transition-all duration-300 hover:border-primary group relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">File attachments</h3>
                <p className="text-muted-foreground text-sm">Attach designs, documents, and assets directly to tasks</p>
              </motion.div>
              <motion.div
                custom={2}
                initial="offscreen"
                whileInView="onscreen"
                viewport={{ once: true, margin: "-50px" }}
                variants={featureCardVariants}
                className="bg-bg-card border rounded-lg p-6 transition-all duration-300 hover:border-primary group relative overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors duration-300">@mentions & notifications</h3>
                <p className="text-muted-foreground text-sm">Get teammates&apos; attention without leaving the platform</p>
              </motion.div>
            </div>
            <Button className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:shadow-primary/20">Learn about collaboration</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AutomationSection;
