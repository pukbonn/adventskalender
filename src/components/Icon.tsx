import "@fontsource-variable/material-symbols-rounded/full.css";
import { cn } from '../lib/utils';

declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

export function MaterialIconStyle() {
  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: we know the code is safe
      dangerouslySetInnerHTML={{
        __html: `
          .iconframe:before {
            content: attr(data-name);
            font-family: "Material Symbols Rounded Variable";
            color: inherit;
            font-weight: normal;
            font-style: normal;
            font-size: inherit; /* Preferred icon size */
            display: inline-block;
            line-height: 0;
            text-transform: none;
            letter-spacing: normal;
            word-wrap: normal;
            white-space: nowrap;
            direction: ltr;
          }

          .iconframe {
            display: inline-flex;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            line-height: 0;
            font-variation-settings: "FILL" var(--fill, 0), "wght" var(--weight, 400), "GRAD" 0, "opsz" 40;
          }
          .iconframe.icon-sm {
            font-size: 18px;
            width: 18px;
            height: 18px;
            font-variation-settings: "FILL" var(--fill, 0), "wght" var(--weight, 400), "GRAD" 0, "opsz" 20;
          }
          .iconframe.icon-md {
            font-size: 24px;
            width: 24px;
            height: 24px;
            font-variation-settings: "FILL" var(--fill, 0), "wght" var(--weight, 400), "GRAD" 0, "opsz" 24;
          }
          .iconframe.icon-xl {
            font-size: 40px;
            width: 40px;
            height: 40px;
            font-variation-settings: "FILL" var(--fill, 0), "wght" var(--weight, 400), "GRAD" 0, "opsz" 40;
          }
          `.replace(/^(\s+)/gm, ''),
      }}
    />
  )
}

export type IconProps = {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  className?: string
}

export function Icon({
  name,
  className,
  ...props
}: IconProps) {
  if (name === 'loading') {
    name = 'progress_activity'
  }

  // per default use the material icon component as a fallback
  return <MaterialIcon className={cn('icon', className)} name={name} {...props} />
}


export function IconDuoTone({ className, name, style = {}, fgStyle, bgStyle, ...props }: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  fgStyle?: React.CSSProperties;
  bgStyle?: React.CSSProperties;
} & IconProps & React.HTMLAttributes<HTMLSpanElement>) {
  if (name === 'loading') {
    name = 'progress_activity'
  }

  return <span className={cn('icon', className)} style={{
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'start',
    justifyContent: 'start',
    ...style,
  }}>
    <MaterialIcon name={name} {...props} style={{
      zIndex: 1,
      position: 'absolute',
      top: 0,
      left: 0,
      '--fill': 1,
      opacity: 0.1,
      color: 'currentColor',
      ...bgStyle,
    }} />
    <MaterialIcon name={name} {...props} style={{
      zIndex: 2,
      '--fill': 0,
      color: 'currentColor',
      ...fgStyle,
    }} />
  </span>
}


export function MaterialIcon({ name, className, size = 'sm', ...props }: IconProps & React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'iconframe',
        `icon-${size}`,
        className
      )}
      data-name={name}
      {...props}
    />
  )
}
