
export interface MessageType {
  id: string;
  user_id: string;
  user_name: string;
  text: string | null;
  image_url: string | null;
  timestamp: string;
  room_id?: string;
  is_read?: boolean;
}

export interface ContactType {
  id: string;
  name: string;
  avatar: string | null;
  role: string;
  isOnline: boolean;
  last_seen?: string;
}
