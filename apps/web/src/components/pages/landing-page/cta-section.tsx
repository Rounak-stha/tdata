import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <section className="landing-section">
      <div className="landing-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="bg-gradient-to-r from-tdata-dark-card to-tdata-dark-card/80 border border-tdata-dark-border rounded-xl p-8 md:p-12 text-center max-w-4xl mx-auto overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_50%)] pointer-events-none"></div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-br from-white to-gray-300 bg-clip-text text-transparent"
          >
            Ready to transform how your team works?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-tdata-muted-text mb-8 max-w-2xl mx-auto"
          >
            Join thousands of teams using Tdata to deliver projects faster, with less friction and more clarity.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Button className="bg-tdata-blue hover:bg-tdata-blue/90 text-white px-6 py-6 h-auto transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-tdata-blue/20">
              Start Free Trial
            </Button>
            <Button variant="outline" className="border-tdata-dark-border hover:border-tdata-blue hover:bg-transparent px-6 py-6 h-auto transition-all duration-300 group">
              Schedule a Demo <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;
