export interface ReviewRequest {
  userId: number;
  gameId: number;
  rating: number;
  comment?: string;
}

export interface ReviewResponse {
  rating: number;
  comment?: string;
} 