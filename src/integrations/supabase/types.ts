export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      expenses: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          expense_date: string
          expense_type: Database["public"]["Enums"]["expense_type_enum"]
          id: number
          technician_id: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          expense_date: string
          expense_type: Database["public"]["Enums"]["expense_type_enum"]
          id?: number
          technician_id: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          expense_date?: string
          expense_type?: Database["public"]["Enums"]["expense_type_enum"]
          id?: number
          technician_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycle_history: {
        Row: {
          created_at: string | null
          id: number
          motorcycle_id: number
          observations: string | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["motorcycle_transaction_type_enum"]
          transaction_value: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          motorcycle_id: number
          observations?: string | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["motorcycle_transaction_type_enum"]
          transaction_value?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          motorcycle_id?: number
          observations?: string | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["motorcycle_transaction_type_enum"]
          transaction_value?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motorcycle_history_motorcycle_id_fkey"
            columns: ["motorcycle_id"]
            isOneToOne: false
            referencedRelation: "motorcycles"
            referencedColumns: ["id"]
          },
        ]
      }
      motorcycles: {
        Row: {
          brand: string
          created_at: string | null
          current_mileage: number | null
          id: number
          license_plate: string
          model: string
          updated_at: string | null
          year: number
        }
        Insert: {
          brand: string
          created_at?: string | null
          current_mileage?: number | null
          id?: number
          license_plate: string
          model: string
          updated_at?: string | null
          year: number
        }
        Update: {
          brand?: string
          created_at?: string | null
          current_mileage?: number | null
          id?: number
          license_plate?: string
          model?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      productivity_records: {
        Row: {
          created_at: string | null
          hours_worked: number | null
          id: number
          installations: number | null
          maintenance_with_replacement: number | null
          maintenance_without_replacement: number | null
          observations: string | null
          record_date: string
          removals: number | null
          tasks_completed: number | null
          technician_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hours_worked?: number | null
          id?: number
          installations?: number | null
          maintenance_with_replacement?: number | null
          maintenance_without_replacement?: number | null
          observations?: string | null
          record_date: string
          removals?: number | null
          tasks_completed?: number | null
          technician_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hours_worked?: number | null
          id?: number
          installations?: number | null
          maintenance_with_replacement?: number | null
          maintenance_without_replacement?: number | null
          observations?: string | null
          record_date?: string
          removals?: number | null
          tasks_completed?: number | null
          technician_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productivity_records_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
      technician_uniforms: {
        Row: {
          assignment_date: string
          created_at: string | null
          quantity: number
          size: Database["public"]["Enums"]["uniform_size_enum"]
          technician_id: number
          uniform_item_id: number
          updated_at: string | null
        }
        Insert: {
          assignment_date: string
          created_at?: string | null
          quantity?: number
          size: Database["public"]["Enums"]["uniform_size_enum"]
          technician_id: number
          uniform_item_id: number
          updated_at?: string | null
        }
        Update: {
          assignment_date?: string
          created_at?: string | null
          quantity?: number
          size?: Database["public"]["Enums"]["uniform_size_enum"]
          technician_id?: number
          uniform_item_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "technician_uniforms_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "technician_uniforms_uniform_item_id_fkey"
            columns: ["uniform_item_id"]
            isOneToOne: false
            referencedRelation: "uniform_items"
            referencedColumns: ["id"]
          },
        ]
      }
      technicians: {
        Row: {
          blood_type: Database["public"]["Enums"]["blood_type_enum"] | null
          created_at: string | null
          date_of_birth: string
          id: number
          name: string
          updated_at: string | null
        }
        Insert: {
          blood_type?: Database["public"]["Enums"]["blood_type_enum"] | null
          created_at?: string | null
          date_of_birth: string
          id?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          blood_type?: Database["public"]["Enums"]["blood_type_enum"] | null
          created_at?: string | null
          date_of_birth?: string
          id?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      uniform_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          item_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          item_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          item_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vacations: {
        Row: {
          created_at: string | null
          end_date: string
          id: number
          start_date: string
          status: Database["public"]["Enums"]["vacation_status_enum"]
          technician_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: number
          start_date: string
          status?: Database["public"]["Enums"]["vacation_status_enum"]
          technician_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: number
          start_date?: string
          status?: Database["public"]["Enums"]["vacation_status_enum"]
          technician_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vacations_technician_id_fkey"
            columns: ["technician_id"]
            isOneToOne: false
            referencedRelation: "technicians"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      blood_type_enum: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-"
      expense_type_enum:
        | "combustivel"
        | "manutencao"
        | "alimentacao"
        | "hospedagem"
        | "pedagio"
        | "banco"
        | "fardamento"
        | "outros"
      motorcycle_transaction_type_enum: "compra" | "troca"
      uniform_size_enum: "PP" | "P" | "M" | "G" | "GG" | "XG" | "XXG"
      vacation_status_enum: "agendada" | "aprovada" | "cancelada" | "concluida"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      blood_type_enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      expense_type_enum: [
        "combustivel",
        "manutencao",
        "alimentacao",
        "hospedagem",
        "pedagio",
        "banco",
        "fardamento",
        "outros",
      ],
      motorcycle_transaction_type_enum: ["compra", "troca"],
      uniform_size_enum: ["PP", "P", "M", "G", "GG", "XG", "XXG"],
      vacation_status_enum: ["agendada", "aprovada", "cancelada", "concluida"],
    },
  },
} as const
