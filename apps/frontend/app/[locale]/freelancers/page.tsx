'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api/client';

interface Freelancer {
  id: string;
  userId: string;
  displayNameEn: string;
  displayNameAr: string;
  bioEn: string;
  bioAr: string;
  avatarUrl: string;
  governorate: string;
  city: string;
  hourlyRate: number;
  jobSuccessScore: number;
  totalJobsCompleted: number;
  totalEarned: string;
  isAvailable: boolean;
  skills: Array<{
    skill: {
      nameEn: string;
      nameAr: string;
    };
  }>;
}

export default function FreelancersPage() {
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFreelancers();
  }, []);

  const loadFreelancers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profiles/search');
      setFreelancers(response.profiles || []);
    } catch (error) {
      console.error('Failed to load freelancers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFreelancers = freelancers.filter((freelancer) =>
    freelancer.displayNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    freelancer.bioEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    freelancer.governorate?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[#2C2C2C] mb-4" style={{ fontFamily: 'Cairo, sans-serif' }}>
            Find Freelancers
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-2xl mx-auto">
            Connect with skilled professionals and tradespeople across Lebanon
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="text"
            placeholder="Search by name, skills, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 text-lg border-[#F5EDE3] focus:border-[#1B5E4A]"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#1B5E4A] border-r-transparent"></div>
            <p className="mt-4 text-[#5A5A5A]">Loading freelancers...</p>
          </div>
        )}

        {/* Freelancers Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFreelancers.length === 0 ? (
              <div className="col-span-full">
                <Card className="text-center py-20 bg-white shadow-md">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#5A5A5A]">
                      {searchQuery ? 'No freelancers found matching your search' : 'No freelancers available'}
                    </CardTitle>
                    <CardDescription>
                      {searchQuery ? 'Try adjusting your search terms' : 'Check back soon'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ) : (
              filteredFreelancers.map((freelancer) => (
                <Card
                  key={freelancer.id}
                  className="bg-white shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="h-3 bg-gradient-to-r from-[#1B5E4A] to-[#E8A945]"></div>
                  <CardHeader className="text-center pb-4">
                    <div className="mx-auto mb-4 w-24 h-24 rounded-full bg-gradient-to-br from-[#1B5E4A] to-[#2D7A62] flex items-center justify-center text-white text-3xl font-bold">
                      {freelancer.displayNameEn.charAt(0).toUpperCase()}
                    </div>
                    <CardTitle className="text-xl text-[#2C2C2C]">
                      {freelancer.displayNameEn}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      📍 {freelancer.governorate}, {freelancer.city}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Bio */}
                    {freelancer.bioEn && (
                      <p className="text-sm text-[#5A5A5A] mb-4 line-clamp-3">
                        {freelancer.bioEn}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                      <div className="bg-[#F5EDE3] rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#1B5E4A]">
                          {freelancer.jobSuccessScore}%
                        </div>
                        <div className="text-xs text-[#5A5A5A]">Success Rate</div>
                      </div>
                      <div className="bg-[#F5EDE3] rounded-lg p-3">
                        <div className="text-2xl font-bold text-[#1B5E4A]">
                          {freelancer.totalJobsCompleted}
                        </div>
                        <div className="text-xs text-[#5A5A5A]">Jobs Done</div>
                      </div>
                    </div>

                    {/* Hourly Rate */}
                    {freelancer.hourlyRate && (
                      <div className="mb-4 text-center">
                        <div className="text-3xl font-bold text-[#E8A945]">
                          ${freelancer.hourlyRate}/hr
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {freelancer.skills && freelancer.skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {freelancer.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="inline-block bg-[#E8A945] bg-opacity-10 text-[#E8A945] text-xs px-3 py-1 rounded-full font-semibold"
                            >
                              {skill.skill.nameEn}
                            </span>
                          ))}
                          {freelancer.skills.length > 3 && (
                            <span className="inline-block bg-[#F5EDE3] text-[#5A5A5A] text-xs px-3 py-1 rounded-full">
                              +{freelancer.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="mb-4">
                      {freelancer.isAvailable ? (
                        <span className="inline-flex items-center gap-2 text-sm text-[#10B981] font-semibold">
                          <span className="w-2 h-2 bg-[#10B981] rounded-full"></span>
                          Available Now
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-[#5A5A5A]">
                          <span className="w-2 h-2 bg-[#5A5A5A] rounded-full"></span>
                          Not Available
                        </span>
                      )}
                    </div>

                    {/* Action Button */}
                    <Button className="w-full bg-[#1B5E4A] hover:bg-[#2D7A62] text-white">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Stats Section */}
        {!loading && freelancers.length > 0 && (
          <div className="mt-12 text-center text-[#5A5A5A]">
            <p className="text-lg">
              Showing <span className="font-bold text-[#1B5E4A]">{filteredFreelancers.length}</span> of{' '}
              <span className="font-bold text-[#1B5E4A]">{freelancers.length}</span> freelancers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
