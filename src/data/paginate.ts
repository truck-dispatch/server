import { Mongoose } from "mongoose"

export default async function paginate<T>(
  model: Mongoose['Model'],
  query: Record<string, unknown>,
  pageParam?: string,
  limitParam?: string
) {
  const page = pageParam ? parseInt(pageParam) : 1
  const limit = limitParam ? parseInt(limitParam) : 10

  try {
    const totalItems = await model.countDocuments(query)
    const totalPages = Math.ceil(totalItems / limit)

    const data: T[] = await model
      .find(query)
      .populate('transporter')
      .populate('tripOwner')
      .lean()
      .skip((page - 1) * limit)
      .limit(limit)

    return {
      data,
      currentPage: page,
      totalPages,
      totalItems,
    }
  } catch (err) {
    throw new Error(
      (err as Error).message || 'Internal Server Error in paginate'
    )
  }
}
