export interface FeatureFlags {
  assessments: boolean;
  attendance: boolean;
  announcements: boolean;
  certificates: boolean;
  support: boolean;
}

// Default feature configuration — all features enabled.
// A superadmin will be able to toggle these per-tenant or globally
// from a backend endpoint in the future. For now this serves as
// the single source of truth consumed by the sidebar and pages.
const features: FeatureFlags = {
  assessments: true,
  attendance: true,
  announcements: true,
  certificates: true,
  support: true,
};

export default features;
