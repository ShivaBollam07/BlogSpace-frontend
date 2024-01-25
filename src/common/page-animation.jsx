import { motion, AnimatePresence } from 'framer-motion';


const AnimationWrapper = ({ children, initial = { opacity: 0 },
     animate = {opacity : 1} , transition = {duration : 1} , keyValue , className}) => {
    return (
        <motion.div
            initial={initial}
            animate={animate}
            transition={transition}
            key = {keyValue}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export default AnimationWrapper;