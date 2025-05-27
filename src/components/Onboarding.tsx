
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAuth } from './AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { MapPin, User, Briefcase, CheckCircle } from 'lucide-react';

const KENYAN_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa', 'Homa Bay',
  'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii',
  'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
  'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi',
  'Narok', 'Nyamira', 'Nyandarua', 'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River',
  'Tharaka-Nithi', 'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
];

const FARMING_TYPES = [
  'Crop Farming', 'Livestock Farming', 'Mixed Farming', 'Dairy Farming', 
  'Poultry Farming', 'Horticulture', 'Coffee Farming', 'Tea Farming', 
  'Fish Farming', 'Beekeeping', 'Organic Farming'
];

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    farmingType: '',
    farmSize: '',
    experience: '',
    primaryCrops: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          location: formData.location,
          username: formData.fullName.toLowerCase().replace(/\s+/g, '_'),
          // Store additional farming info in a JSON field if needed
        });

      if (error) throw error;

      toast({
        title: "Welcome to AgriPrice Helper!",
        description: "Your profile has been set up successfully.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName && formData.location;
      case 2:
        return formData.farmingType && formData.farmSize;
      case 3:
        return formData.experience;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to AgriPrice Helper</CardTitle>
          <p className="text-muted-foreground">Let's set up your farmer profile</p>
          
          {/* Progress indicator */}
          <div className="flex justify-center mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i <= step ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {i < step ? <CheckCircle className="h-4 w-4" /> : i}
                </div>
                {i < 3 && <div className={`w-12 h-1 ${i < step ? 'bg-primary' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">County/Location</label>
                <Select value={formData.location} onValueChange={(value) => setFormData({...formData, location: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your county" />
                  </SelectTrigger>
                  <SelectContent>
                    {KENYAN_COUNTIES.map((county) => (
                      <SelectItem key={county} value={county}>{county}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Farming Details</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Farming Type</label>
                <Select value={formData.farmingType} onValueChange={(value) => setFormData({...formData, farmingType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farming type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FARMING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Farm Size (in acres)</label>
                <Select value={formData.farmSize} onValueChange={(value) => setFormData({...formData, farmSize: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select farm size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 acre</SelectItem>
                    <SelectItem value="1-5">1-5 acres</SelectItem>
                    <SelectItem value="5-10">5-10 acres</SelectItem>
                    <SelectItem value="10-25">10-25 acres</SelectItem>
                    <SelectItem value="25-50">25-50 acres</SelectItem>
                    <SelectItem value="more-than-50">More than 50 acres</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Crops/Livestock</label>
                <Input
                  placeholder="e.g., Maize, Beans, Dairy Cows"
                  value={formData.primaryCrops}
                  onChange={(e) => setFormData({...formData, primaryCrops: e.target.value})}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Experience Level</h3>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Years of Farming Experience</label>
                <Select value={formData.experience} onValueChange={(value) => setFormData({...formData, experience: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (3-7 years)</SelectItem>
                    <SelectItem value="experienced">Experienced (8-15 years)</SelectItem>
                    <SelectItem value="expert">Expert (15+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">What you'll get:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Real-time market prices for your crops</li>
                  <li>• Weather updates for your location</li>
                  <li>• Agricultural insights and recommendations</li>
                  <li>• Connect with other farmers in your area</li>
                  <li>• Access to expert agricultural advice</li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={!isStepValid() || isSubmitting}>
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
