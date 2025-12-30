import { motion } from "framer-motion"

export function NumbersDisplay({ count = 0, singularLabel = 'Tag', pluralLabel = 'Tagen' }) {
  return (<motion.div
    key={`${singularLabel}-${pluralLabel}-${count === 0}`}
    style={{ display: 'flex', gap: '4px' }}
    initial={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
    animate={{ y: "0", filter: "blur(0px)", opacity: count === 0 ? 0.3 : 1 }}
    exit={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
    transition={{ type: "spring", bounce: 0.35 }}
  >
    <strong>
      {String(count).padStart(2, '0').split('').map((digit, index) => (
        <motion.div
          style={{ display: 'inline-block', textAlign: 'center', width: '12px' }}
          key={`${digit}-${index}`}
          initial={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
          animate={{ y: "0", filter: "blur(0px)", opacity: 1 }}
          exit={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.35 }}
        >
          {digit === '0' && index === 0 ? '' : digit}
        </motion.div>
      ))}
    </strong>
    <span>{count === 1 ? singularLabel : pluralLabel}</span>
  </motion.div>
  )
}
