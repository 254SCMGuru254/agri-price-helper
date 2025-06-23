import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Users, Tool, Calendar } from 'lucide-react';

export const FarmerCollaboration = () => {
  const [activeTab, setActiveTab] = useState('equipment');

  const equipmentSharing = [
    { name: 'Tractor', owner: 'John M.', location: 'Nakuru', available: 'Weekends' },
    { name: 'Irrigation Pump', owner: 'Sarah W.', location: 'Kisumu', available: 'Daily' },
    { name: 'Harvester', owner: 'David K.', location: 'Eldoret', available: 'On Request' }
  ];

  const groupBuying = [
    { item: 'Fertilizer', quantity: '1000kg', location: 'Meru', deadline: '2024-07-01' },
    { item: 'Seeds', quantity: '500kg', location: 'Thika', deadline: '2024-07-15' }
  ];

  const skillSharing = [
    { skill: 'Organic Farming', expert: 'Mary N.', experience: '15 years' },
    { skill: 'Greenhouse Management', expert: 'Peter O.', experience: '8 years' }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Farmer Collaboration Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="equipment" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="equipment" onClick={() => setActiveTab('equipment')}>
              <Tool className="h-4 w-4 mr-2" />
              Equipment Sharing
            </TabsTrigger>
            <TabsTrigger value="group-buying" onClick={() => setActiveTab('group-buying')}>
              <Users className="h-4 w-4 mr-2" />
              Group Buying
            </TabsTrigger>
            <TabsTrigger value="skill-sharing" onClick={() => setActiveTab('skill-sharing')}>
              <Calendar className="h-4 w-4 mr-2" />
              Skill Sharing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="equipment" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Available Equipment</h3>
                <Button variant="outline">List Equipment</Button>
              </div>
              <div className="grid gap-4">
                {equipmentSharing.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Owner: {item.owner} • Location: {item.location}
                        </p>
                      </div>
                      <Button size="sm">Request</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="group-buying" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Active Group Purchases</h3>
                <Button variant="outline">Start Group Buy</Button>
              </div>
              <div className="grid gap-4">
                {groupBuying.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.item}</h4>
                        <p className="text-sm text-muted-foreground">
                          Quantity: {item.quantity} • Location: {item.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Deadline: {new Date(item.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm">Join Group</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="skill-sharing" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Available Mentors</h3>
                <Button variant="outline">Offer Skills</Button>
              </div>
              <div className="grid gap-4">
                {skillSharing.map((item, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.skill}</h4>
                        <p className="text-sm text-muted-foreground">
                          Expert: {item.expert} • Experience: {item.experience}
                        </p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}; 