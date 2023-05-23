import { Model, Document } from 'mongoose';

export default async function countDocuments<T>(
  model: Model<T>,
  query: Record<string, unknown>,
  pageParam?: string,
  limitParam?: string
) {
  const page = pageParam ? parseInt(pageParam) : 1;
  const limit = limitParam ? parseInt(limitParam) : 10;

  try {
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
    };
  } catch (err) {
    throw new Error(
      (err as Error).message || 'Internal Server Error in paginate'
    );
  }
}
