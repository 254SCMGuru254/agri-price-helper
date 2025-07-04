export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ad_watches: {
        Row: {
          id: string
          user_id: string
          watched_at: string
        }
        Insert: {
          id?: string
          user_id: string
          watched_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          watched_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_watches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agricultural_advice: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agricultural_advice_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agricultural_statistics: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          name: string
          updated_at: string | null
          value: number
          year: number
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: string
          updated_at?: string | null
          value: number
          year: number
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          updated_at?: string | null
          value?: number
          year?: number
        }
        Relationships: []
      }
      business_listings: {
        Row: {
          business_name: string
          business_type: string
          contact_clicks: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          featured_type: string | null
          featured_until: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          is_verified: boolean | null
          location: string
          products_services: string[] | null
          status: string | null
          telegram_username: string | null
          title: string
          updated_at: string | null
          user_id: string
          verified_at: string | null
          verified_by: string | null
          views_count: number | null
          website_url: string | null
          whatsapp_number: string | null
        }
        Insert: {
          business_name: string
          business_type: string
          contact_clicks?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          featured_type?: string | null
          featured_until?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          location: string
          products_services?: string[] | null
          status?: string | null
          telegram_username?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
          views_count?: number | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Update: {
          business_name?: string
          business_type?: string
          contact_clicks?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          featured_type?: string | null
          featured_until?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          location?: string
          products_services?: string[] | null
          status?: string | null
          telegram_username?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
          views_count?: number | null
          website_url?: string | null
          whatsapp_number?: string | null
        }
        Relationships: []
      }
      cold_storage_facilities: {
        Row: {
          available_space: string
          capacity: string
          contact: string
          created_at: string
          features: string[] | null
          id: string
          location: string
          name: string
          rates_per_day: number
        }
        Insert: {
          available_space: string
          capacity: string
          contact: string
          created_at?: string
          features?: string[] | null
          id?: string
          location: string
          name: string
          rates_per_day: number
        }
        Update: {
          available_space?: string
          capacity?: string
          contact?: string
          created_at?: string
          features?: string[] | null
          id?: string
          location?: string
          name?: string
          rates_per_day?: number
        }
        Relationships: []
      }
      commodity_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      crop_calendars: {
        Row: {
          created_at: string
          crop_name: string
          harvest_date: string
          id: string
          notes: string | null
          planting_date: string
          region: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          crop_name: string
          harvest_date: string
          id?: string
          notes?: string | null
          planting_date: string
          region: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          crop_name?: string
          harvest_date?: string
          id?: string
          notes?: string | null
          planting_date?: string
          region?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crop_calendars_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_qa: {
        Row: {
          answer: string | null
          answered_by: string | null
          asked_by: string
          category: string
          created_at: string
          id: string
          question: string
          status: string
          updated_at: string
        }
        Insert: {
          answer?: string | null
          answered_by?: string | null
          asked_by: string
          category: string
          created_at?: string
          id?: string
          question: string
          status?: string
          updated_at?: string
        }
        Update: {
          answer?: string | null
          answered_by?: string | null
          asked_by?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_qa_answered_by_fkey"
            columns: ["answered_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_qa_asked_by_fkey"
            columns: ["asked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_payments: {
        Row: {
          amount: number
          business_listing_id: string
          created_at: string | null
          currency: string | null
          duration_months: number
          id: string
          payment_method: string
          payment_reference: string | null
          payment_status: string | null
          paypal_order_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          business_listing_id: string
          created_at?: string | null
          currency?: string | null
          duration_months: number
          id?: string
          payment_method: string
          payment_reference?: string | null
          payment_status?: string | null
          paypal_order_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          business_listing_id?: string
          created_at?: string | null
          currency?: string | null
          duration_months?: number
          id?: string
          payment_method?: string
          payment_reference?: string | null
          payment_status?: string | null
          paypal_order_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "featured_payments_business_listing_id_fkey"
            columns: ["business_listing_id"]
            isOneToOne: false
            referencedRelation: "business_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          author_id: string
          category: string
          content: string
          created_at: string
          id: string
          likes_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          category: string
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      logistics_providers: {
        Row: {
          capacity: string
          contact: string
          created_at: string
          id: string
          name: string
          rates_per_km: number
          regions_served: string[]
          vehicle_type: string
          verified: boolean | null
        }
        Insert: {
          capacity: string
          contact: string
          created_at?: string
          id?: string
          name: string
          rates_per_km: number
          regions_served: string[]
          vehicle_type: string
          verified?: boolean | null
        }
        Update: {
          capacity?: string
          contact?: string
          created_at?: string
          id?: string
          name?: string
          rates_per_km?: number
          regions_served?: string[]
          vehicle_type?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          category_id: string | null
          commodity: string
          created_at: string
          id: string
          is_organic: boolean
          location: string
          metadata: Json | null
          price: number
          source: string | null
          status: Database["public"]["Enums"]["price_status"] | null
          submitted_by: string
          unit: string
          updated_at: string
          verified_at: string | null
          verified_by: string | null
          votes_count: number | null
        }
        Insert: {
          category_id?: string | null
          commodity: string
          created_at?: string
          id?: string
          is_organic?: boolean
          location: string
          metadata?: Json | null
          price: number
          source?: string | null
          status?: Database["public"]["Enums"]["price_status"] | null
          submitted_by: string
          unit: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          votes_count?: number | null
        }
        Update: {
          category_id?: string | null
          commodity?: string
          created_at?: string
          id?: string
          is_organic?: boolean
          location?: string
          metadata?: Json | null
          price?: number
          source?: string | null
          status?: Database["public"]["Enums"]["price_status"] | null
          submitted_by?: string
          unit?: string
          updated_at?: string
          verified_at?: string | null
          verified_by?: string | null
          votes_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "market_prices_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "commodity_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_prices_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "market_prices_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          image_url: string | null
          is_read: boolean | null
          room_id: string | null
          text: string | null
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          room_id?: string | null
          text?: string | null
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          id?: string
          image_url?: string | null
          is_read?: boolean | null
          room_id?: string | null
          text?: string | null
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      price_analysis: {
        Row: {
          analysis_type: string
          created_at: string | null
          data: Json
          id: string
        }
        Insert: {
          analysis_type: string
          created_at?: string | null
          data: Json
          id?: string
        }
        Update: {
          analysis_type?: string
          created_at?: string | null
          data?: Json
          id?: string
        }
        Relationships: []
      }
      price_votes: {
        Row: {
          created_at: string
          id: string
          is_valid: boolean
          price_id: string
          voter_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_valid: boolean
          price_id: string
          voter_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_valid?: boolean
          price_id?: string
          voter_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_votes_price_id_fkey"
            columns: ["price_id"]
            isOneToOne: false
            referencedRelation: "market_prices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_votes_voter_id_fkey"
            columns: ["voter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_listings: {
        Row: {
          contact_info: string
          created_at: string
          description: string
          expires_at: string | null
          id: string
          price: number | null
          status: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          contact_info: string
          created_at?: string
          description: string
          expires_at?: string | null
          id?: string
          price?: number | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          contact_info?: string
          created_at?: string
          description?: string
          expires_at?: string | null
          id?: string
          price?: number | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          location: string | null
          points: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          location?: string | null
          points?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          location?: string | null
          points?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      success_stories: {
        Row: {
          content: string
          created_at: string
          farmer_id: string
          id: string
          likes_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          farmer_id: string
          id?: string
          likes_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          farmer_id?: string
          id?: string
          likes_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "success_stories_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_logs: {
        Row: {
          activity_type: string
          created_at: string | null
          errors: string[] | null
          id: string
          records_processed: number | null
          success: boolean | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          errors?: string[] | null
          id?: string
          records_processed?: number | null
          success?: boolean | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          errors?: string[] | null
          id?: string
          records_processed?: number | null
          success?: boolean | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          created_at: string
          id: string
          key: string
          language_code: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          language_code: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          language_code?: string
          value?: string
        }
        Relationships: []
      }
      user_activity_log: {
        Row: {
          action_type: string
          created_at: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action_type: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action_type?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          id: string
          points: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number
          reward_type: Database["public"]["Enums"]["reward_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          points?: number
          reward_type?: Database["public"]["Enums"]["reward_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_free_featured_listings: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      can_create_product_listing: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      price_status: "pending" | "approved" | "rejected"
      reward_type: "ad_watch" | "price_submission" | "advice_submission"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      price_status: ["pending", "approved", "rejected"],
      reward_type: ["ad_watch", "price_submission", "advice_submission"],
    },
  },
} as const
