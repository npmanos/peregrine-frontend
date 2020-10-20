import { PropsOf } from '@/type-utils'
import clsx from 'clsx'
import { css } from 'linaria'

const unstyledListStyle = css`
  padding: 0;
  margin: 0;
  list-style-type: none;
`

export const UnstyledList = (props: PropsOf<'ul'>) => (
  <ul {...props} class={clsx(props.class, unstyledListStyle)} />
)
