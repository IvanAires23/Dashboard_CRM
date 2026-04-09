const DEFAULT_HEADERS = {
  Accept: 'application/json',
}

const DEFAULT_ERROR_MESSAGE = 'Something went wrong while processing the request.'

function getEnvBaseUrl() {
  return import.meta.env?.VITE_API_URL ?? import.meta.env?.VITE_API_BASE_URL ?? ''
}

function isAbsoluteUrl(value) {
  return /^https?:\/\//i.test(value)
}

function normalizeUrl(baseUrl, path) {
  if (!path) {
    return baseUrl || ''
  }

  if (isAbsoluteUrl(path)) {
    return path
  }

  if (!baseUrl) {
    return path
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  return `${normalizedBase}${normalizedPath}`
}

function appendQueryParams(url, query) {
  if (!query || typeof query !== 'object') {
    return url
  }

  const searchParams = new URLSearchParams()

  const appendValue = (key, value) => {
    if (value === undefined || value === null) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => appendValue(key, item))
      return
    }

    if (value instanceof Date) {
      searchParams.append(key, value.toISOString())
      return
    }

    searchParams.append(key, String(value))
  }

  Object.entries(query).forEach(([key, value]) => appendValue(key, value))

  const queryString = searchParams.toString()

  if (!queryString) {
    return url
  }

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
}

function canHaveBody(method) {
  const normalizedMethod = method.toUpperCase()
  return normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD'
}

function isJsonPayload(payload) {
  if (payload === null || payload === undefined) {
    return false
  }

  if (payload instanceof FormData) {
    return false
  }

  if (payload instanceof URLSearchParams) {
    return false
  }

  if (typeof Blob !== 'undefined' && payload instanceof Blob) {
    return false
  }

  if (typeof ArrayBuffer !== 'undefined' && payload instanceof ArrayBuffer) {
    return false
  }

  return typeof payload === 'object'
}

function parseErrorMessage(data) {
  if (!data) {
    return null
  }

  if (typeof data === 'string') {
    return data
  }

  if (typeof data.message === 'string' && data.message.trim()) {
    return data.message
  }

  if (typeof data.error === 'string' && data.error.trim()) {
    return data.error
  }

  if (data.error && typeof data.error.message === 'string' && data.error.message.trim()) {
    return data.error.message
  }

  return null
}

function createHttpError({
  message = DEFAULT_ERROR_MESSAGE,
  code = 'HTTP_ERROR',
  status = null,
  method = null,
  url = null,
  details = null,
  cause = null,
}) {
  const error = new Error(message, { cause })
  error.name = 'HttpError'
  error.code = code
  error.status = status
  error.method = method
  error.url = url
  error.details = details
  error.isHttpError = true
  return error
}

async function parseResponseBody(response) {
  if (response.status === 204 || response.status === 205) {
    return null
  }

  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  const text = await response.text()
  return text || null
}

export function createHttpClient(config = {}) {
  const baseUrl = config.baseUrl ?? getEnvBaseUrl()
  const headers = {
    ...DEFAULT_HEADERS,
    ...(config.headers || {}),
  }

  const request = async (path, options = {}) => {
    const {
      method = 'GET',
      params,
      query,
      body,
      headers: customHeaders = {},
      ...fetchOptions
    } = options

    const requestMethod = method.toUpperCase()
    const targetUrl = appendQueryParams(
      normalizeUrl(baseUrl, path),
      query ?? params,
    )

    const requestHeaders = new Headers({
      ...headers,
      ...customHeaders,
    })

    const fetchConfig = {
      ...fetchOptions,
      method: requestMethod,
      headers: requestHeaders,
    }

    if (canHaveBody(requestMethod) && body !== undefined) {
      if (isJsonPayload(body)) {
        if (!requestHeaders.has('Content-Type')) {
          requestHeaders.set('Content-Type', 'application/json')
        }
        fetchConfig.body = JSON.stringify(body)
      } else {
        fetchConfig.body = body
      }
    }

    let response

    try {
      response = await fetch(targetUrl, fetchConfig)
    } catch (error) {
      if (error?.isHttpError) {
        throw error
      }

      throw createHttpError({
        message: 'Network request failed.',
        code: 'NETWORK_ERROR',
        method: requestMethod,
        url: targetUrl,
        cause: error,
      })
    }

    let responseData

    try {
      responseData = await parseResponseBody(response)
    } catch (error) {
      throw createHttpError({
        message: 'Failed to parse server response.',
        code: 'PARSE_ERROR',
        status: response.status,
        method: requestMethod,
        url: targetUrl,
        cause: error,
      })
    }

    if (!response.ok) {
      throw createHttpError({
        message:
          parseErrorMessage(responseData) ||
          `Request failed with status ${response.status}.`,
        code: 'HTTP_ERROR',
        status: response.status,
        method: requestMethod,
        url: targetUrl,
        details: responseData,
      })
    }

    return responseData
  }

  const get = (path, options = {}) =>
    request(path, { ...options, method: 'GET' })

  const post = (path, body, options = {}) =>
    request(path, { ...options, method: 'POST', body })

  const put = (path, body, options = {}) =>
    request(path, { ...options, method: 'PUT', body })

  const patch = (path, body, options = {}) =>
    request(path, { ...options, method: 'PATCH', body })

  const remove = (path, options = {}) =>
    request(path, { ...options, method: 'DELETE' })

  return {
    request,
    get,
    post,
    put,
    patch,
    delete: remove,
  }
}

const http = createHttpClient()

export const request = http.request
export const get = http.get
export const post = http.post
export const put = http.put
export const patch = http.patch
export const del = http.delete

export default http
