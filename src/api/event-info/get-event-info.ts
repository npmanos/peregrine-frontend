import { request } from '../base'
import { EventInfo, processEvent } from '.'
import { cacheable, transaction } from '@/cache'

// Only TBA events, and custom events from their realm are available to
// non-super-admins.
export const getEventInfo = (eventKey: string) =>
  cacheable(
    request<EventInfo>('GET', `events/${eventKey}`).then(processEvent),
    eventInfo =>
      transaction('events', eventStore => {
        eventStore.put(eventInfo, eventKey)
      }),
    () => transaction('events', eventStore => eventStore.get(eventKey)),
  )
