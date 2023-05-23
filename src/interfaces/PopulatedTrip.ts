import Trip from './Trip'
import User from './User'

export default interface PopulatedTrip
  extends Omit<Trip, 'transporter' | 'tripOwner'> {
  transporter?: User
  tripOwner: User
}
