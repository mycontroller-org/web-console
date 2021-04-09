export const GridBreakPoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
export const GridColumns = { lg: 100, md: 100, sm: 100, xs: 1, xxs: 1 }

export const WidgetTitleHeight = 34 // 34px

export const getWidgetWidth = (windowWidth, gridColumns) => {
  if (windowWidth > 768) {
    return (windowWidth * (gridColumns / 100)).toFixed(0)
  }
  return windowWidth
}

export const getWidgetHeight = (windowHeight, gridHeight, showTitle = true) => {
  if (showTitle) {
    return (windowHeight * (gridHeight / 100)).toFixed(0) - WidgetTitleHeight
  }
  return (windowHeight * (gridHeight / 100)).toFixed(0)
}
