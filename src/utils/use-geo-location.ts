import { useEffect, useState } from 'preact/hooks'
import { EMPTY_PROMISE } from './empty-promise'

const apiKey = __IPDATA_API_KEY__
const apiUrl =
  apiKey && `https://api.ipdata.co/?api-key=${apiKey}&fields=latitude,longitude`

export interface LatLong {
  latitude: number
  longitude: number
}

const getIpLocation = () =>
  apiUrl
    ? fetch(apiUrl)
        .then((result) => result.json())
        .then(
          (data): Promise<LatLong> =>
            data.latitude && data.longitude ? data : EMPTY_PROMISE,
        )
    : EMPTY_PROMISE

const getGeoLocation = () =>
  new Promise<LatLong>((resolve) =>
    navigator.geolocation.getCurrentPosition(
      (result) =>
        resolve({
          latitude: result.coords.latitude,
          longitude: result.coords.longitude,
        }),
      // If there is an error, just use IP
      () => resolve(getIpLocation()),
    ),
  )

const getLocation = async (): Promise<LatLong> => {
  if (navigator.permissions) {
    const geoPermission = await navigator.permissions.query({
      name: 'geolocation',
    })
    if (geoPermission.state === 'granted') return getGeoLocation()
  }
  return getIpLocation()
}

const locationKey = 'geolocation'

const getLocationFromLocalStorage = () => {
  const result = localStorage.getItem(locationKey)
  if (result) return JSON.parse(result) as LatLong
}

const saveLocationToLocalStorage = (loc: LatLong) => {
  localStorage.setItem(locationKey, JSON.stringify(loc))
  return loc
}

export const useGeoLocation = () => {
  const [location, setLocation] = useState<LatLong | undefined>(
    getLocationFromLocalStorage(),
  )
  const [canPrompt, setCanPrompt] = useState<boolean>(
    navigator.permissions === undefined,
  )
  useEffect(() => {
    getLocation().then(saveLocationToLocalStorage).then(setLocation)
  }, [])

  useEffect(() => {
    let geoPermission: PermissionStatus | undefined
    const onPositionChange = () => {
      if (geoPermission) setCanPrompt(geoPermission.state === 'prompt')
    }
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then((permission) => {
          geoPermission = permission
          geoPermission.addEventListener('change', onPositionChange)
          onPositionChange()
        })
    }

    return () => {
      if (geoPermission)
        geoPermission.removeEventListener('change', onPositionChange)
    }
  }, [])

  const prompt =
    canPrompt &&
    (() => {
      getGeoLocation().then(saveLocationToLocalStorage).then(setLocation)
    })

  return [location, prompt] as const
}
