
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export const PriceFormImproved: React.FC<PriceFormProps> = ({
  formData,
  setFormData,
  categories,
  isSubmitting,
  onSubmit,
}) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-center">
          Submit Market Price
        </CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Help fellow farmers by sharing real market prices from your area
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category_id: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50 max-h-[200px] overflow-y-auto">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="commodity">Crop/Commodity</Label>
              <Input
                id="commodity"
                required
                value={formData.commodity}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, commodity: e.target.value }))
                }
                placeholder="e.g., Tomatoes, Maize, Beans"
                className="w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (KES)</Label>
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
                className="w-full"
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
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="g">Gram (g)</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="bunch">Bunch</SelectItem>
                  <SelectItem value="bag">Bag (90kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Market Location</Label>
            <Input
              id="location"
              required
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
              placeholder="e.g., Nairobi City Market, Kisumu Central Market"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Include the specific market or town name
            </p>
          </div>

          <div className="flex items-center space-x-2 p-3 bg-muted/50 rounded-lg">
            <Switch
              id="organic"
              checked={formData.is_organic}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_organic: checked }))
              }
            />
            <Label htmlFor="organic" className="flex-1">
              This is an organic product
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
            {isSubmitting ? "Submitting..." : "Submit Price"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Your submission will be verified by other farmers before being published
          </p>
        </form>
      </CardContent>
    </Card>
  );
};
