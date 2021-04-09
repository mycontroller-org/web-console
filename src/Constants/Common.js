export const NOTIFICATION_LIMIT = 50

export const TOAST_ALERT_TIMEOUT = 5000

export const ALERT_TYPE_DEFAULT = "default"
export const ALERT_TYPE_INFO = "info"
export const ALERT_TYPE_SUCCESS = "success"
export const ALERT_TYPE_WARN = "warning"
export const ALERT_TYPE_ERROR = "danger"

export const DATA_CACHE_TIMEOUT = 0 // in seconds, data cache in list tables. 0 - disabled

export const NAV_WIDTH = 290

export const getWindowWidth = (windowSizeWidth, isNavOpen) => {
  if (windowSizeWidth < 1200) {
    return windowSizeWidth
  } else if (isNavOpen) {
    return windowSizeWidth - NAV_WIDTH
  }
  return windowSizeWidth
}
