import { h, RenderableProps } from 'preact'
import Card from '@/components/card'
import NumberInput from './number-input'
import { css } from 'linaria'
import Toggle from './toggle'
import { ReportStatDescription, NumberStatDescription } from '@/api/schema'
import { cleanFieldName } from '@/utils/clean-field-name'

const fieldCardStyle = css`
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  padding: 0.6rem;
  grid-gap: 0.6rem;
  margin: 0.6rem auto;
`

const nameStyle = css`
  font-weight: bold;
`

interface Props<FieldType extends ReportStatDescription> {
  statDescription: FieldType
  value: number
  onChange: (newValue: number) => void
  outlined: boolean
}

const isNumberField = (
  value: ReportStatDescription,
): value is NumberStatDescription => value.type === 'number'

const FieldCard = <FieldType extends ReportStatDescription>({
  statDescription,
  onChange,
  value,
  outlined,
}: RenderableProps<Props<FieldType>>) => (
  <Card as="label" class={fieldCardStyle} outlined={outlined}>
    <div class={nameStyle}>{cleanFieldName(statDescription.name)}</div>
    {isNumberField(statDescription) ? (
      <NumberInput value={value} min={0} onChange={onChange} />
    ) : (
      <Toggle
        checked={Boolean(value)}
        onChange={value => onChange(Number(value))}
      />
    )}
  </Card>
)

export default FieldCard
