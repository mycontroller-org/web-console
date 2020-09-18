import { getBase } from "./base"

const slice = getBase("resourceGateway")

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
