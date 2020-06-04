const isNetlify = __NODE_ENV__ === 'production' && __BRANCH__

export const apiUrl =
  (__PEREGRINE_API_URL__ || (isNetlify ? '/api' : 'https://peregrine.ga/api')) +
  '/'
