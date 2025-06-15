
import type { IntegrationRecommendation } from "./types";

export class IntegrationRecommendationsService {
  static getRecommendedIntegrations(): IntegrationRecommendation[] {
    return [
      {
        name: "Google Sheets",
        description: "Export and analyze data in spreadsheets",
        integration: "Use Google Sheets API for data export and collaborative analysis",
        cost: "Free"
      },
      {
        name: "Airtable",
        description: "Database-like storage with advanced filtering",
        integration: "Store and organize agricultural data with custom views",
        cost: "Free tier available"
      },
      {
        name: "Zapier",
        description: "Automate data workflows",
        integration: "Connect to 1000+ apps for data processing automation",
        cost: "Free tier available"
      },
      {
        name: "GitHub Actions",
        description: "Automated data processing workflows",
        integration: "Run scheduled data sync and analysis jobs",
        cost: "Free for public repos"
      }
    ];
  }
}
