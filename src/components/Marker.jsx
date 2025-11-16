// import { Emoji } from '@/components/Emoji'
import { forwardRef } from 'react';

// function BigEmoij(props: React.ComponentProps<typeof Emoji>) {
//   return (
//     <div className="h-[48px] w-[48px] text-center font-black text-[48px] leading-[48px]">
//       <Emoji {...props} />
//     </div>
//   )
// }

const size = '48px'

export const Marker = forwardRef(function Marker({
  entry,
}, ref) {
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
      }}
      ref={ref}
    >
      <div
        className="marker-inner"
        style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: '"Playfair Display", serif',
          fontWeight: '900',
          fontStyle: 'italic',
          fontSize: '32px',
          textDecoration: 'none',
          textAlign: 'center',

          color: 'var(--inverted-text)',
          background: 'var(--inverted-background)',
          padding: '8px',
          borderRadius: '0px',
        }}
      >
        {entry.title?.length ? entry.title : '?'}
      </div>
    </div>
  )
})
