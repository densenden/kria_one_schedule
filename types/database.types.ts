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
      tenants: {
        Row: {
          id: string
          slug: string
          name: string
          domain: string | null
          primary_color: string
          secondary_color: string
          logo_url: string | null
          favicon_url: string | null
          email: string | null
          phone: string | null
          address: string | null
          stripe_account_id: string | null
          stripe_onboarding_complete: boolean
          settings: Json
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          domain?: string | null
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          domain?: string | null
          primary_color?: string
          secondary_color?: string
          logo_url?: string | null
          favicon_url?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          settings?: Json
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          clerk_user_id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          role: 'member' | 'coach' | 'admin' | 'owner'
          bio: string | null
          athlete_info: Json
          social_links: Json
          is_public: boolean
          notification_preferences: Json
          last_login_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          tenant_id: string
          clerk_user_id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'member' | 'coach' | 'admin' | 'owner'
          bio?: string | null
          athlete_info?: Json
          social_links?: Json
          is_public?: boolean
          notification_preferences?: Json
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          clerk_user_id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          role?: 'member' | 'coach' | 'admin' | 'owner'
          bio?: string | null
          athlete_info?: Json
          social_links?: Json
          is_public?: boolean
          notification_preferences?: Json
          last_login_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      courses: {
        Row: {
          id: string
          tenant_id: string
          title: string
          description: string | null
          short_description: string | null
          type: string
          tags: string[]
          image_url: string | null
          gallery_urls: string[]
          instructor_id: string | null
          max_participants: number
          min_participants: number
          price: number | null
          currency: string
          duration_minutes: number
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
          requirements: string | null
          is_active: boolean
          is_featured: boolean
          meta_title: string | null
          meta_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          title: string
          description?: string | null
          short_description?: string | null
          type: string
          tags?: string[]
          image_url?: string | null
          gallery_urls?: string[]
          instructor_id?: string | null
          max_participants?: number
          min_participants?: number
          price?: number | null
          currency?: string
          duration_minutes?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
          requirements?: string | null
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          title?: string
          description?: string | null
          short_description?: string | null
          type?: string
          tags?: string[]
          image_url?: string | null
          gallery_urls?: string[]
          instructor_id?: string | null
          max_participants?: number
          min_participants?: number
          price?: number | null
          currency?: string
          duration_minutes?: number
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | 'all' | null
          requirements?: string | null
          is_active?: boolean
          is_featured?: boolean
          meta_title?: string | null
          meta_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courses_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courses_instructor_id_fkey"
            columns: ["instructor_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      schedules: {
        Row: {
          id: string
          tenant_id: string
          course_id: string
          start_time: string
          end_time: string
          location: string
          location_details: string | null
          available_spots: number | null
          instructor_id: string | null
          price_override: number | null
          recurrence_rule: string | null
          recurrence_parent_id: string | null
          is_cancelled: boolean
          cancellation_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          course_id: string
          start_time: string
          end_time: string
          location: string
          location_details?: string | null
          available_spots?: number | null
          instructor_id?: string | null
          price_override?: number | null
          recurrence_rule?: string | null
          recurrence_parent_id?: string | null
          is_cancelled?: boolean
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          course_id?: string
          start_time?: string
          end_time?: string
          location?: string
          location_details?: string | null
          available_spots?: number | null
          instructor_id?: string | null
          price_override?: number | null
          recurrence_rule?: string | null
          recurrence_parent_id?: string | null
          is_cancelled?: boolean
          cancellation_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_course_id_fkey"
            columns: ["course_id"]
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_instructor_id_fkey"
            columns: ["instructor_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          schedule_id: string
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          amount: number | null
          currency: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          booked_at: string
          confirmed_at: string | null
          cancelled_at: string | null
          refunded_at: string | null
          is_visible: boolean
          user_notes: string | null
          admin_notes: string | null
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          schedule_id: string
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          booked_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
          is_visible?: boolean
          user_notes?: string | null
          admin_notes?: string | null
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          schedule_id?: string
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          amount?: number | null
          currency?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'refunded' | 'no_show'
          booked_at?: string
          confirmed_at?: string | null
          cancelled_at?: string | null
          refunded_at?: string | null
          is_visible?: boolean
          user_notes?: string | null
          admin_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          id: string
          tenant_id: string
          slug: string
          title: string
          content: Json
          meta_title: string | null
          meta_description: string | null
          is_published: boolean
          published_at: string | null
          show_in_nav: boolean
          nav_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          slug: string
          title: string
          content?: Json
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          published_at?: string | null
          show_in_nav?: boolean
          nav_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          slug?: string
          title?: string
          content?: Json
          meta_title?: string | null
          meta_description?: string | null
          is_published?: boolean
          published_at?: string | null
          show_in_nav?: boolean
          nav_order?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pages_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          }
        ]
      }
      waitlist: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          schedule_id: string
          position: number
          notified_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          schedule_id: string
          position: number
          notified_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          schedule_id?: string
          position?: number
          notified_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "waitlist_tenant_id_fkey"
            columns: ["tenant_id"]
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "waitlist_schedule_id_fkey"
            columns: ["schedule_id"]
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_tenant_schedules: {
        Args: {
          p_tenant_id: string
          p_from_date?: string
          p_to_date?: string
        }
        Returns: {
          schedule_id: string
          course_id: string
          course_title: string
          course_type: string
          course_image: string | null
          instructor_name: string | null
          instructor_avatar: string | null
          start_time: string
          end_time: string
          location: string
          available_spots: number | null
          total_spots: number | null
          booked_count: number
          price: number | null
          is_cancelled: boolean
        }[]
      }
      get_schedule_participants: {
        Args: {
          p_schedule_id: string
        }
        Returns: {
          user_id: string
          full_name: string | null
          avatar_url: string | null
          is_visible: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience types
export type Tenant = Tables<'tenants'>
export type User = Tables<'users'>
export type Course = Tables<'courses'>
export type Schedule = Tables<'schedules'>
export type Booking = Tables<'bookings'>
export type Page = Tables<'pages'>
export type Waitlist = Tables<'waitlist'>

export type UserRole = User['role']
export type BookingStatus = Booking['status']
export type DifficultyLevel = NonNullable<Course['difficulty_level']>
