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
          date_of_birth: string | null
          age_verified_at: string | null
          terms_accepted_at: string | null
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
          date_of_birth?: string | null
          age_verified_at?: string | null
          terms_accepted_at?: string | null
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
          date_of_birth?: string | null
          age_verified_at?: string | null
          terms_accepted_at?: string | null
          created_at?: string
        }
      }
      // Owned & written by the external membership funnel
      // (membership.getluckygolfclub.com). This app only READS it (by email)
      // to surface member status — it never writes here.
      members: {
        Row: {
          id: string
          full_name: string
          email: string
          mobile: string
          club_id: string | null
          handicap: number | null
          subscription_status: string | null
          payfast_payment_id: string | null
          payfast_token: string | null
          joined_date: string | null
          last_payment_date: string | null
          cancelled_date: string | null
          cancellation_reason: string | null
          bag_tag_status: string | null
          is_founding_member: boolean | null
          referral_code: string | null
          referred_by: string | null
          plan_type: string
          indwe_credit_applied_until: string | null
          indwe_lead_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: never
        Update: never
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
          image_url: string | null
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
          image_url?: string | null
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
          image_url?: string | null
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
