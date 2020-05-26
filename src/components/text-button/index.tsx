import { css } from 'linaria'
import { pxToRem } from '@/utils/px-to-rem'
import { rgba, darken } from 'polished'
import { h } from 'preact'
import { PropsOf } from '@/type-utils'
import clsx from 'clsx'

const buttonStyle = css`
  background: transparent;
  border: none;
  text-transform: uppercase;
  border-radius: 4px;
  transition: all 0.3s ease;
  cursor: pointer;
  font-weight: 500;
  font-size: ${pxToRem(14)};
  padding: 0 ${pxToRem(8)};
  height: ${pxToRem(36)};
  font-family: inherit;
  white-space: nowrap;
  color: ${darken(0.03, 'purple')};

  &:hover {
    background: ${rgba('purple', 0.08)};
  }

  &:active,
  &:focus {
    outline: none;
    background: ${rgba('purple', 0.18)};
  }
`

export const TextButton = (props: PropsOf<'button'>) => {
  return <button {...props} class={clsx(buttonStyle, props.class)} />
}
