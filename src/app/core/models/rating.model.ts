export type RatingTargetType = 'HOST' | 'ACCOMMODATION';

export interface RatingResponse {
  id: string;
  targetId: string;
  targetType: RatingTargetType;
  guestFirstName: string;
  guestLastName: string;
  guestId: string;
  score: number;
  createdAt: string;
  updatedAt: string;
}

export interface RatingsSummaryResponse {
  ratings: RatingResponse[];
  averageScore: number;
  totalCount: number;
}

export interface CreateRatingRequest {
  targetId: string;
  targetType: RatingTargetType;
  score: number;
}

export interface UpdateRatingRequest {
  score: number;
}
