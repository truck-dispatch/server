import Rating from './Rating'
import User from './User'
import Vehicle from './Vehicle'

export default interface UserFullProfile extends User {
  vehicles?: Vehicle[]
  ratings: Rating[]
}
