'use client';

import { Button } from '@/components/ui/button';
import { Share2, ExternalLink, Target, Zap, Trophy, Brain, BrainIcon } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import NavBar from '@/components/nav-bar';
import { useState, useEffect } from 'react';
import { getPortfolioPage } from '@/services/portfolio.service';
import { PortfolioProject } from '@/interfaces/project.interface';
import MarkdownWrapper from '@/components/MarkdownWrapper';

// Extended interface to handle both API and mock data

// Mock user data - in real app this would come from database
const userData = {
  id: 'le-minh-quy',
  name: 'Minh',
  initials: 'Minh',
  bio: 'Học sinh tiên phong trong kỷ nguyên AI, sẵn sàng kiến tạo tương lai.',
  platformSlogan: 'Xây dựng trên nền tảng "Đồng hành cùng AI - Dẫn lối sáng tạo Việt"'
};

// Mock project data for fallback - will be replaced by API data

export default function ProfilePage() {
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        const portfolioData = await getPortfolioPage();
        setPortfolioProjects(portfolioData.projects);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch portfolio:', err);
        setError('Failed to load portfolio data');
        // Fallback to mock data if API fails
        // setPortfolioProjects(mockCompletedProjects as DisplayProject[]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, []);

  // Combine API data with mock data structure for display

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error && portfolioProjects.length === 0) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center'>
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{error}</p>
          <p className='text-gray-600'>Showing mock data as fallback</p>
        </div>
      </div>
    );
  }
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='bg-white rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden'>
          <div className='absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400'></div>

          <div className='text-center'>
            <div className='w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-lg'>
              {userData.initials}
            </div>
            <h1 className='text-4xl font-bold text-gray-800 mb-4'>{userData.name}</h1>
            <p className='text-xl text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed'>
              {userData.bio}
            </p>
            <p className='text-sm text-blue-600 font-medium opacity-80'>
              {userData.platformSlogan}
            </p>
          </div>

          <div className='flex justify-center gap-4 mt-8'>
            <Button variant='outline' className='gap-2 bg-transparent'>
              <Share2 className='w-4 h-4' />
              Chia sẻ hồ sơ
            </Button>
            <Button className='gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500'>
              <ExternalLink className='w-4 h-4' />
              Xem công khai
            </Button>
          </div>
        </div>

        <section className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-800 text-center mb-8 relative'>
            Dự Án Nổi Bật
            <div className='absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full'></div>
          </h2>

          <div className='grid gap-8 md:grid-cols-1 lg:grid-cols-2'>
            {portfolioProjects.map((project, index) => (
              <article
                key={index}
                className='bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-blue-100 animate-fade-in-up'
                style={{ animationDelay: `${index * 0.1}s` }}>
                <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
                  {project.mission_name || `Project ${project.id}`}
                </h3>
                <p className='text-gray-600 mb-8 leading-relaxed'>
                  {project.mission_description || 'Project description not available'}
                </p>

                <div className='mb-8'>
                  <div className='flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4'>
                    <Target className='w-5 h-5' />
                    Phần 1: Sản phẩm cuối cùng
                  </div>
                  <blockquote className='bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg italic text-gray-800 leading-relaxed relative'>
                    <div className='absolute top-[-10px] left-4 text-3xl text-blue-500 opacity-30 font-serif'></div>
                    <MarkdownWrapper>
                      {project.final_product || 'No final product description provided.'}
                    </MarkdownWrapper>
                  </blockquote>
                </div>

                <div className='mb-8'>
                  <div className='flex items-center gap-2 text-lg font-semibold text-red-600 mb-4'>
                    <Zap className='w-5 h-5' />
                    Phần 2: Những câu lệnh nổi bật
                  </div>
                  <div className='bg-gray-900 rounded-lg p-6 font-mono text-sm leading-relaxed'>
                    <div className='flex items-center gap-2 mb-4 text-gray-400 text-xs'>
                      <div className='flex gap-1'>
                        <div className='w-3 h-3 bg-red-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-yellow-500 rounded-full'></div>
                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                      </div>
                      <span>AI Terminal</span>
                    </div>

                    {(project.featured_prompts || []).map((prompt, idx) => (
                      <div key={idx} className='mb-4'>
                        <div className='text-cyan-400 mb-2'>user@creativity:~$ prompt_optimize</div>
                        <div className='text-black bg-white bg-opacity-5 p-3 rounded border-l-2 border-cyan-400 ml-4'>
                          <MarkdownWrapper>{prompt}</MarkdownWrapper>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className='flex items-center gap-2 text-lg font-semibold text-gray-700 mb-2'>
                    <BrainIcon className='w-5 h-5' />
                    Phần 3: Bài học tự rút ra
                  </div>
                  <div className='flex flex-wrap gap-3 text-ellipsis mb-2 bg-blue-50 border border-blue-600 text-black p-4 rounded-lg'>
                    <p className='tracking-tight font-semibold italic'>
                      {project.reflection ? project.reflection : 'Không có'}
                    </p>
                  </div>
                </div>

                <div>
                  <div className='flex items-center gap-2 text-lg font-semibold text-gray-700 mb-4'>
                    <Trophy className='w-5 h-5' />
                    Phần 4: Kỹ năng đã áp dụng
                  </div>
                  <div className='flex flex-wrap gap-3'>
                    {(project.skills || []).map((skill) => (
                      <span
                        key={skill}
                        className='bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium border border-blue-200 hover:from-blue-200 hover:to-cyan-200 hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer'>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
