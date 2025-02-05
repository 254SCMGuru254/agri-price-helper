
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];

interface FilterState {
  search: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  location: string;
  isOrganic: boolean | null;
  isVerified: boolean | null;
}

interface MarketFiltersProps {
  filters: FilterState;
  categories: Category[];
  onFilterChange: (filters: Partial<FilterState>) => void;
}

export const MarketFilters = ({ filters, categories, onFilterChange }: MarketFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Input
          placeholder="Search commodities..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
        />
        <Select
          value={filters.category}
          onValueChange={(value) => onFilterChange({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min price"
          value={filters.minPrice}
          onChange={(e) => onFilterChange({ minPrice: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={filters.isOrganic === true ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange({ isOrganic: filters.isOrganic === true ? null : true })}
        >
          Organic
        </Badge>
        <Badge
          variant={filters.isOrganic === false ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange({ isOrganic: filters.isOrganic === false ? null : false })}
        >
          Non-Organic
        </Badge>
        <Badge
          variant={filters.isVerified === true ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange({ isVerified: filters.isVerified === true ? null : true })}
        >
          Verified
        </Badge>
        <Badge
          variant={filters.isVerified === false ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onFilterChange({ isVerified: filters.isVerified === false ? null : false })}
        >
          Unverified
        </Badge>
      </div>
    </div>
  );
};
