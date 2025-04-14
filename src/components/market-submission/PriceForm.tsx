
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["commodity_categories"]["Row"];

interface FormData {
  commodity: string;
  price: string;
  unit: string;
  location: string;
  is_organic: boolean;
  category_id: string;
}

interface PriceFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: Category[];
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const PriceForm: React.FC<PriceFormProps> = ({
  formData,
  setFormData,
  categories,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-md mx-auto p-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category_id}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category_id: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="commodity">Commodity</Label>
        <Input
          id="commodity"
          required
          value={formData.commodity}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, commodity: e.target.value }))
          }
          placeholder="e.g., Tomatoes"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          required
          min="0"
          step="0.01"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, price: e.target.value }))
          }
          placeholder="0.00"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Select
          value={formData.unit}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, unit: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="kg">Kilogram (kg)</SelectItem>
            <SelectItem value="g">Gram (g)</SelectItem>
            <SelectItem value="ton">Ton</SelectItem>
            <SelectItem value="piece">Piece</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          required
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          placeholder="e.g., Nairobi"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="organic"
          checked={formData.is_organic}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, is_organic: checked }))
          }
        />
        <Label htmlFor="organic">Organic Product</Label>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Price"}
      </Button>
    </form>
  );
};
