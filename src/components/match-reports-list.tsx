import { h } from 'preact'
import { GetReport } from '@/api/report'
import { ReportEditor } from './report-editor'
import { useMatchInfo } from '@/cache/match-info/use'
import { Schema } from '@/api/schema'
import Button from './button'
import { createDialog } from './dialog'

interface Props {
  reports: GetReport[]
  eventKey: string
  matchKey: string
  schema: Schema
}

export const MatchReportsList = ({
  reports,
  eventKey,
  matchKey,
  schema,
}: Props) => {
  const matchInfo = useMatchInfo(eventKey, matchKey)

  if (reports.length === 0 || !matchInfo) return null
  return (
    <div>
      {reports.map((r, i) => (
        <Button
          key={r.reporterId}
          onClick={e => {
            e.stopPropagation()

            createDialog({
              title: 'Edit report',
              description: (
                // TODO: Extract a subcomponent from reporteditor
                // that does not have saving functionality,
                // and also doesn't have team picking functionality,
                // then use that directly here
                <ReportEditor
                  outlinedCards
                  key={r.reporterId}
                  showSave={false}
                  eventKey={eventKey}
                  match={matchInfo}
                  matchKey={matchKey}
                  schema={schema}
                  initialReport={r}
                />
              ),
              confirm: 'save',
            })
          }}
        >{`Edit report ${i}`}</Button>
      ))}
    </div>
  )
}
