import { motion } from 'framer-motion';
import { Award, Trophy, CircleDot, Activity } from 'lucide-react';

export const Hero = () => {
  return (
    <section className="relative w-full py-20 overflow-hidden bg-ipl-bg-dark border-b border-white/10">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-ipl-primary/20 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-ipl-primary-dark/20 blur-[150px]"></div>
        <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[40%] rounded-full bg-ipl-accent/10 blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Content */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ipl-primary/10 border border-ipl-primary/30 text-ipl-primary mb-6">
            <Activity size={16} />
            <span className="text-sm font-medium tracking-wider uppercase">Premium Analytics</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-ipl-text-muted to-white/70 tracking-tight leading-tight mb-6">
            IPL Match <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-ipl-primary to-ipl-primary-dark">Analytics Dashboard</span>
          </h1>
          <p className="text-lg text-ipl-text-muted max-w-2xl mx-auto lg:mx-0 mb-8 leading-relaxed">
            Explore Toss Impact, Match Trends and Team Performance through Interactive Data Visualizations. Uncover the hidden stories behind every delivery and decision.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <a href="#toss-analysis" className="px-8 py-4 rounded-full bg-gradient-to-r from-ipl-primary to-ipl-primary-dark text-white font-semibold text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-shadow">
              Explore Data
            </a>
          </motion.div>
        </motion.div>

        {/* Right Content - Abstract Cricket Stadium / Elements */}
        <div className="flex-1 relative w-full max-w-md lg:max-w-none h-[400px] flex items-center justify-center perspective-1000">
          <motion.div
            animate={{ rotateY: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative w-64 h-64 preserve-3d"
          >
            {/* Central Trophy */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-ipl-accent to-ipl-accent-light opacity-20 blur-2xl absolute"></div>
              <Trophy size={100} className="text-ipl-accent drop-shadow-[0_0_15px_rgba(255,107,53,0.5)]" strokeWidth={1} />
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div className="absolute inset-0 flex items-center justify-between animate-[spin_10s_linear_infinite]">
               <div className="w-12 h-12 bg-ipl-bg-card rounded-full border border-white/10 flex items-center justify-center shadow-lg -ml-6 -mt-16 transform -rotate-45">
                 <Award className="text-ipl-primary" size={24} />
               </div>
               <div className="w-12 h-12 bg-ipl-bg-card rounded-full border border-white/10 flex items-center justify-center shadow-lg -mr-6 mt-16 transform -rotate-45">
                 <CircleDot className="text-ipl-success" size={24} />
               </div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};
