import { request } from '../base'
import { EventInfo, processEvent } from '.'
import { cacheable, transaction } from '@/cache'

// Getting events will only list TBA events, unless a user is signed in. If the
// user is a super-admin, they will see all events, otherwise they will see all
// TBA events and additionally all the custom events on their realm.
export const getEvents = () =>
  cacheable(
    request<EventInfo[]>('GET', 'events').then(events =>
      events.map(processEvent),
    ),
    events =>
      transaction('events', eventStore => {
        events.forEach(event => eventStore.put(event, event.key))
      }),
    () => transaction('events', eventStore => eventStore.getAll()),
  )
