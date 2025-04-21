
export type Schema = {
  emergency_reports: {
    id: string;
    person_name: string | null;
    symptoms: string | null;
    report_type: string;
    location_lat: number;
    location_lng: number;
    created_at: string;
    status: string;
    user_id: string;
    assigned_hospital_id?: string | null;
  };
  
  hospitals: {
    id: string;
    hospital_name: string;
    registration_number: string;
    address: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    contact_phone: string | null;
    services: any | null;
  };
};
