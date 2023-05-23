export default interface Rating {
  _id: string
  trip: string
  comment: string
  /**The id of the user presently rating */
  userRating: string
  /**The id of the user presently being rated */
  userRated: string
  starRating: number
}
