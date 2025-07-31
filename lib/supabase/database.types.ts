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
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          athlete_info: Json
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          athlete_info?: Json
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          athlete_info?: Json
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          id: string
          medusa_product_id: string | null
          title: string
          description: string | null
          type: Database['public']['Enums']['course_type']
          image_url: string | null
          instructor_id: string | null
          max_participants: number | null
          price: number | null
          duration_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          medusa_product_id?: string | null
          title: string
          description?: string | null
          type: Database['public']['Enums']['course_type']
          image_url?: string | null
          instructor_id?: string | null
          max_participants?: number | null
          price?: number | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          medusa_product_id?: string | null
          title?: string
          description?: string | null
          type?: Database['public']['Enums']['course_type']
          image_url?: string | null
          instructor_id?: string | null
          max_participants?: number | null
          price?: number | null
          duration_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      course_schedules: {
        Row: {
          id: string
          course_id: string
          start_time: string
          end_time: string
          location: string
          available_spots: number | null
          is_cancelled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          start_time: string
          end_time: string
          location: string
          available_spots?: number | null
          is_cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          start_time?: string
          end_time?: string
          location?: string
          available_spots?: number | null
          is_cancelled?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_schedules_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          schedule_id: string
          stripe_session_id: string | null
          stripe_payment_intent_id: string | null
          status: string
          amount: number | null
          booked_at: string
          cancelled_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          schedule_id: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          amount?: number | null
          booked_at?: string
          cancelled_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          schedule_id?: string
          stripe_session_id?: string | null
          stripe_payment_intent_id?: string | null
          status?: string
          amount?: number | null
          booked_at?: string
          cancelled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "course_schedules"
            referencedColumns: ["id"]
          }
        ]
      }
      course_participants: {
        Row: {
          booking_id: string
          schedule_id: string
          user_id: string
          is_visible: boolean
        }
        Insert: {
          booking_id: string
          schedule_id: string
          user_id: string
          is_visible?: boolean
        }
        Update: {
          booking_id?: string
          schedule_id?: string
          user_id?: string
          is_visible?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "course_participants_booking_id_fkey"
            columns: ["booking_id"]
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_participants_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "course_schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_participants_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_upcoming_schedules: {
        Args: {
          from_date?: string
          to_date?: string
        }
        Returns: {
          schedule_id: string
          course_id: string
          course_title: string
          course_type: Database['public']['Enums']['course_type']
          course_image: string | null
          instructor_name: string | null
          start_time: string
          end_time: string
          location: string
          available_spots: number | null
          total_spots: number | null
          participant_count: number
          price: number | null
        }[]
      }
    }
    Enums: {
      course_type: 'swimming' | 'functional_training' | 'animal_movement' | 'conditioning' | 'fitness'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}