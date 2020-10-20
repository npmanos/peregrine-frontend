import { VNode } from 'preact'
import { PropsOf } from '@/type-utils'
import Icon from '@/components/icon'
import { css } from 'linaria'
import clsx from 'clsx'
import { grey } from '@/colors'
import { transparentize } from 'polished'

const iconButtonStyle = css`
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: inherit;
  background: transparent;
  border: none;
  padding: 0;

  &:hover,
  &:focus {
    background: ${transparentize(0.75, '#aaa')};
    outline: none;
  }

  &[disabled] {
    cursor: not-allowed;
  }
`

export { iconButtonStyle as iconButtonClass }

interface BaseProps {
  icon: string
}

interface IconButton {
  (props: BaseProps & PropsOf<'a'> & { href: string }): VNode
  (props: BaseProps & PropsOf<'div'>): VNode
}

const IconButton: IconButton = ({
  icon,
  ...attrs
}: PropsOf<'a' | 'div'> & BaseProps) => {
  const El = attrs.href ? 'a' : 'button'
  return (
    <El {...(attrs as any)} class={clsx(iconButtonStyle, attrs.class)}>
      <Icon icon={icon} />
    </El>
  )
}

export default IconButton

const inlineIconButtonStyle = css`
  width: 1.7rem;
  height: 1.7rem;
  padding: 0.35rem;
  color: ${grey};
  display: inline-flex;
`

export const InlineIconButton: IconButton = ({
  icon,
  ...attrs
}: PropsOf<'a' | 'div'> & BaseProps) => {
  const El = attrs.href ? 'a' : 'button'
  return (
    <El
      {...(attrs as any)}
      class={clsx(inlineIconButtonStyle, iconButtonStyle, attrs.class)}
    >
      <Icon icon={icon} />
    </El>
  )
}
