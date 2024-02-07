import { GetHelpModel } from './GetHelpModel'
import GetHelpData from '@interfaces/GetHelpData'

export async function recordGetHelpData(getHelpData: GetHelpData) {
  const data = new GetHelpModel(getHelpData)
  await data.save()
  return data
}
