import React from 'react';
import PropTypes from 'prop-types';

import { motion } from 'framer-motion';

// Inspired from
// https://reacttricks.com/animating-next-page-transitions-with-framer-motion/
// and https://github.com/kheruc/rt-next-motion
const easing = [0.175, 0.85, 0.42, 0.96];

const fadeInTransitionUp = {
  opacity: 1,
  y: 0,
  transition: { duration: 0.6, delay: 0.2, ease: easing },
};
const fadeOutTransitionDown = {
  opacity: 0,
  y: 100,
  transition: { duration: 0.6, delay: 0.1, ease: easing },
};

const DefaultPageTransitionWrapper: React.FC<{}> = ({ children }) => (
  <motion.div
    initial="exit"
    animate="enter"
    exit="exit"
    variants={{
      enter: fadeInTransitionUp,
      exit: fadeOutTransitionDown,
    }}
  >
    {children}
  </motion.div>
);

DefaultPageTransitionWrapper.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default DefaultPageTransitionWrapper;
