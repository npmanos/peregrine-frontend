import { css } from 'static-css-extract'
import { PropsOf } from '@/type-utils'
import { h } from 'preact'
import clsx from 'clsx'

const unstyledListStyle = css`
  padding: 0;
  margin: 0;
  list-style-type: none;
`

export const UnstyledList = (props: PropsOf<'ul'>) => {
  return <ul {...props} class={clsx(unstyledListStyle, props.class)} />
}
