import type { Venue } from '../../types';
import { hospitalVenue } from './hospital';
import { railwayVenue } from './railway';
import { airportVenue } from './airport';

export const venues: Venue[] = [hospitalVenue, railwayVenue, airportVenue];

export { hospitalVenue, railwayVenue, airportVenue };
