import { motion } from "framer-motion"

export function NumbersDisplay({ padLength = 2, count = 0, singularLabel = 'Tag', pluralLabel = 'Tagen' }) {
  const digitArray = String(count).padStart(padLength, '0').split('')
  const label = count === 1 ? singularLabel : pluralLabel

  return (<div style={{ display: 'flex', gap: '4px' }}>
    <strong>
      {digitArray.map((digit, index) => {

        let isLeadingZero = false
        const zeroString = '0'
        if (digit === zeroString) {
          if (padLength === 3) {
            if (index === 0 && digitArray[0] === zeroString) {
              isLeadingZero = true
            } else if (index === 1 && digitArray[0] === zeroString && digitArray[1] === zeroString) {
              isLeadingZero = true
            }
          } else if (padLength === 2) {
            if (index === 0 && digitArray[0] === zeroString) {
              isLeadingZero = true
            }
          }
        }

        return (<motion.div
          style={{ display: 'inline-block', textAlign: 'center', width: '12px' }}
          key={`digit-${label}-${digit}-${index}`}
          initial={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
          animate={{ y: "0", filter: "blur(0px)", opacity: 1 }}
          exit={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
          transition={{ type: "spring", bounce: 0.35 }}
        >
          {isLeadingZero ? '' : digit}
        </motion.div>)
      })}
    </strong>

    <motion.span
      key={`label-${label}`}
      initial={{ y: "-12px", filter: "blur(2px)", opacity: 0 }}
      animate={{ y: "0", filter: "blur(0px)", opacity: 1 }}
      exit={{ y: "12px", filter: "blur(2px)", opacity: 0 }}
      transition={{ type: "spring", bounce: 0.35 }}
    >
      {label}
    </motion.span>
  </div>
  )
}
