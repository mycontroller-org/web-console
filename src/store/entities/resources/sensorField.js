import { getBase } from "./base"

const slice = getBase("resourceSensorField")

export default slice.reducer

export const {
  updateRecords,
  loading,
  loadingFailed,
  updateFilter,
  deleteFilterValue,
  deleteFilterCategory,
  deleteAllFilter,
  onSortBy,
} = slice.actions
