export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          handicap: number | null
          home_course_id: string | null
          payment_method: string | null
          payment_token: string | null
          onboarding_done: boolean
          payment_setup_done: boolean
          total_attempts: number
          is_admin: boolean
          suspended_at: string | null
          suspended_reason: string | null
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          handicap?: number | null
          home_course_id?: string | null
          payment_method?: string | null
          payment_token?: string | null
          onboarding_done?: boolean
          payment_setup_done?: boolean
          total_attempts?: number
          is_admin?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          handicap?: number | null
          home_course_id?: string | null
          payment_method?: string | null
          payment_token?: string | null
          onboarding_done?: boolean
          payment_setup_done?: boolean
          total_attempts?: number
          is_admin?: boolean
          suspended_at?: string | null
          suspended_reason?: string | null
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          name: string
          location_text: string | null
          region: string | null
          country: string
          lat: number | null
          lng: number | null
          is_partner: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          location_text?: string | null
          region?: string | null
          country?: string
          lat?: number | null
          lng?: number | null
          is_partner?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          location_text?: string | null
          region?: string | null
          country?: string
          lat?: number | null
          lng?: number | null
          is_partner?: boolean
          created_at?: string
        }
      }
      holes: {
        Row: {
          id: string
          course_id: string
          hole_number: number
          par: number
          distance_metres: number | null
          is_active: boolean
          jackpot_amount: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          hole_number: number
          par?: number
          distance_metres?: number | null
          is_active?: boolean
          jackpot_amount?: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          hole_number?: number
          par?: number
          distance_metres?: number | null
          is_active?: boolean
          jackpot_amount?: number
          created_at?: string
        }
      }
      bets: {
        Row: {
          id: string
          user_id: string
          course_id: string
          hole_id: string
          tier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5'
          stake_pence: number
          potential_win_pence: number
          status: 'active' | 'miss' | 'claimed' | 'verified' | 'paid'
          payment_intent_id: string | null
          video_url: string | null
          declared_result: 'miss' | 'win' | null
          declared_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          hole_id: string
          tier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5'
          stake_pence: number
          potential_win_pence: number
          status?: 'active' | 'miss' | 'claimed' | 'verified' | 'paid'
          payment_intent_id?: string | null
          video_url?: string | null
          declared_result?: 'miss' | 'win' | null
          declared_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          hole_id?: string
          tier?: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4' | 'tier_5'
          stake_pence?: number
          potential_win_pence?: number
          status?: 'active' | 'miss' | 'claimed' | 'verified' | 'paid'
          payment_intent_id?: string | null
          video_url?: string | null
          declared_result?: 'miss' | 'win' | null
          declared_at?: string | null
          created_at?: string
        }
      }
      verifications: {
        Row: {
          id: string
          bet_id: string
          status: 'pending' | 'documents_received' | 'under_review' | 'approved' | 'rejected'
          certificate_path: string | null
          affidavit_path: string | null
          footage_received_at: string | null
          documents_received_at: string | null
          verified_at: string | null
          payout_initiated_at: string | null
          reviewer_notes: string | null
          reviewed_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          bet_id: string
          status?: 'pending' | 'documents_received' | 'under_review' | 'approved' | 'rejected'
          certificate_path?: string | null
          affidavit_path?: string | null
          footage_received_at?: string | null
          documents_received_at?: string | null
          verified_at?: string | null
          payout_initiated_at?: string | null
          reviewer_notes?: string | null
          reviewed_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          bet_id?: string
          status?: 'pending' | 'documents_received' | 'under_review' | 'approved' | 'rejected'
          certificate_path?: string | null
          affidavit_path?: string | null
          footage_received_at?: string | null
          documents_received_at?: string | null
          verified_at?: string | null
          payout_initiated_at?: string | null
          reviewer_notes?: string | null
          reviewed_by?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
