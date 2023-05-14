export default async function paginate<T>(
  model: any,
  query: Record<string, unknown>,
  pageParam?: string,
  limitParam?: string
) {
  const page = pageParam ? parseInt(pageParam) : 1
  const limit = limitParam ? parseInt(limitParam) : 5

  try {
    const totalItems = await model.countDocuments(query)
    const totalPages = Math.ceil(totalItems / limit)

    const data: T[] = await model
      .find(query)
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
