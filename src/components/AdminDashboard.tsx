'use client';

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Twitter, Send, Github, Trash2 } from "lucide-react"
import { useDynamicContext } from "@dynamic-labs/sdk-react-core"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useDropzone } from 'react-dropzone'
import { fetchWebsiteInfo } from '@/lib/utils';

// Replace the uuid import with this:
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

interface AdminDashboardComponentProps {
  setError: (error: string | null) => void;
}

export default function AdminDashboardComponent({ setError }: AdminDashboardComponentProps) {
  const [profile, setProfile] = useState<any>(null)
  const [projects, setProjects] = useState<any[]>([])
  const [favoriteApps, setFavoriteApps] = useState<any[]>([])
  const [allowMessages, setAllowMessages] = useState<boolean>(true)
  const [newProjectUrl, setNewProjectUrl] = useState('')
  const [newAppUrl, setNewAppUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter();
  const { user } = useDynamicContext();
  const supabase = createClientComponentClient()

  useEffect(() => {
    console.log('AdminDashboardComponent mounted');
    if (user?.verifiedCredentials?.[0]?.address) {
      console.log('User address available:', user.verifiedCredentials[0].address);
      fetchProfile();
    } else {
      console.log('No user address available');
      setLoading(false);
      setError('No user address available');
    }
  }, [user]);

  async function fetchProfile() {
    try {
      console.log('Fetching profile...');
      setLoading(true);
      setError(null);
  
      const { data, error } = await supabase
        .from('users')
        .select('*, projects(*), favorite_apps(*), social_media_links(*)')
        .eq('dynamic_user_id', user?.verifiedCredentials?.[0]?.address)
        .maybeSingle();
  
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
  
      if (!data) {
        console.log('No profile found, creating new user');
        const newUser = {
          dynamic_user_id: user?.verifiedCredentials?.[0]?.address,
          username: user?.email?.split('@')[0] || 'New User',
          email: user?.email,
        };
  
        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUser)
          .select('*, projects(*), favorite_apps(*), social_media_links(*)')
          .single();
  
        if (createError) {
          console.error('Error creating new user:', createError);
          throw createError;
        }
  
        console.log('New profile created:', createdUser);
        setProfile(createdUser);
        setProjects(createdUser.projects || []);
        setFavoriteApps(createdUser.favorite_apps || []);
        setAllowMessages(createdUser.allow_messages || false);
      } else {
        console.log('Profile fetched successfully:', data);
        setProfile(data);
        setProjects(data.projects || []);
        setFavoriteApps(data.favorite_apps || []);
        setAllowMessages(data.allow_messages || false);
      }
    } catch (err: any) {
      console.error('Error in fetchProfile:', err);
      setError(`Failed to load profile: ${err.message || 'Unknown error'}. Please try again.`);
    } finally {
      console.log('Fetch profile completed');
      setLoading(false);
    }
  }

  async function updateProfile(field: string, value: any) {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('users')
        .update({ [field]: value })
        .eq('dynamic_user_id', user?.verifiedCredentials?.[0]?.address)
        .single()

      if (error) throw error

      setProfile({ ...profile, [field]: value })
    } catch (err: any) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile. Please try again.')
    }
  }

  

  async function addProject() {
    try {
      setError(null)
      
      // Fetch website info
      const metadata = await fetchWebsiteInfo(newProjectUrl);

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: metadata.title || 'Untitled Project',
          url: newProjectUrl,
          image_url: metadata.favicon,
          user_id: profile.id
        })
        .select()
        .single()
  
      if (error) throw error
  
      setProjects([...projects, data])
      setNewProjectUrl('')
    } catch (err: any) {
      console.error('Error adding project:', err)
      setError(`Failed to add project: ${err.message}`)
    }
  }

  async function deleteProject(projectId: string) {
    try {
      setError(null)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error

      setProjects(projects.filter(p => p.id !== projectId))
    } catch (err: any) {
      console.error('Error deleting project:', err)
      setError('Failed to delete project. Please try again.')
    }
  }

  async function addFavoriteApp() {
    try {
      setError(null)
      
      // Fetch website info
      const metadata = await fetchWebsiteInfo(newAppUrl);

      const { data, error } = await supabase
        .from('favorite_apps')
        .insert({
          app_name: metadata.title || 'Untitled App',
          url: newAppUrl,
          image_url: metadata.favicon,
          user_id: profile.id
        })
        .select()
        .single()
  
      if (error) throw error
  
      setFavoriteApps([...favoriteApps, data])
      setNewAppUrl('')
    } catch (err: any) {
      console.error('Error adding favorite app:', err)
      setError(`Failed to add favorite app: ${err.message}`)
    }
  }
  
  async function deleteFavoriteApp(appId: string) {
    try {
      setError(null)
      const { error } = await supabase
        .from('favorite_apps')
        .delete()
        .eq('id', appId)

      if (error) throw error

      setFavoriteApps(favoriteApps.filter(app => app.id !== appId))
    } catch (err: any) {
      console.error('Error deleting favorite app:', err)
      setError('Failed to delete favorite app. Please try again.')
    }
  }

  async function trackReferral(itemId: string, itemType: 'project' | 'app') {
    try {
      const { data, error } = await supabase
        .from('referral_points')
        .insert({
          user_id: profile.id,
          item_id: itemId,
          item_type: itemType
        })

      if (error) throw error
    } catch (err: any) {
      console.error('Error tracking referral:', err)
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `avatars/${user?.verifiedCredentials?.[0]?.address}/${fileName}`

      try {
        setError(null)
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath)

        const { error: updateError } = await supabase
          .from('users')
          .update({ avatar: publicUrl })
          .eq('dynamic_user_id', user?.verifiedCredentials?.[0]?.address)

        if (updateError) throw updateError

        setProfile({ ...profile, avatar: publicUrl })
      } catch (error: any) {
        console.error('Error uploading avatar:', error)
        setError(`Failed to upload avatar: ${error.message}`)
      }
    }
  }, [user, profile, setError, supabase])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  console.log('Rendering AdminDashboardComponent', { loading, profile });

  if (loading) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">Loading profile data...</div>;
  if (!profile) return <div className="min-h-screen bg-[#111111] text-white flex items-center justify-center">No profile data available. Please try refreshing the page.</div>;

  return (
    <div className="min-h-screen bg-[#111111] text-white relative p-8">
      <div className="max-w-2xl mx-auto">
        <div className="absolute top-4 right-4">
          <Button 
            className="group relative px-6 py-2 text-sm text-[#F2FFC8] font-semibold rounded-lg overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#111111] focus:ring-[#F2FFC8]"
            onClick={() => updateProfile('published', !profile.published)}
          >
            <span className="relative z-10 transition-opacity duration-300 group-hover:opacity-80">
              {profile.published ? 'Unpublish' : 'Publish'}
            </span>
            <div className="absolute inset-0 z-0 rainbow-border"></div>
          </Button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-32 h-32 mb-4">
            <AvatarImage src={profile.avatar || "/placeholder.svg?height=128&width=128"} alt="Profile picture" />
            <AvatarFallback>{profile.username?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-black hover:bg-[#B9B9B9] hover:text-black transition-colors duration-200"
            >
              Upload Avatar
            </Button>
          </div>
        </div>

        <Input 
          className="mb-3 bg-[#1C1C1C] border-[#272727] hover:bg-[#242424] focus:ring-0 focus:border-[#3A3A3A] transition-colors duration-200" 
          placeholder="Username" 
          value={profile.username}
          onChange={(e) => updateProfile('username', e.target.value)}
        />

        <Textarea 
          className="mb-3 bg-[#1C1C1C] border-[#272727] hover:bg-[#242424] focus:ring-0 focus:border-[#3A3A3A] transition-colors duration-200" 
          placeholder="Bio"
          value={profile.bio}
          onChange={(e) => updateProfile('bio', e.target.value)}
        />

        <div className="flex justify-center mb-6">
          <div className="flex items-center">
            <div className="flex space-x-4 mr-4">
              {profile.social_media_links?.map((link: { id: string; platform: string }) => (
                <button key={link.id} className="text-gray-400 hover:text-white transition-colors">
                  {link.platform === 'twitter' && <Twitter />}
                  {link.platform === 'telegram' && <Send />}
                  {link.platform === 'github' && <Github />}
                </button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-black hover:bg-[#B9B9B9] hover:text-black transition-colors duration-200"
              onClick={() => {/* Implement add social link logic */}}
            >
              Add Social
            </Button>
          </div>
        </div>

        <div className="mb-6 bg-[#161616] p-4 rounded-xl">
          <h2 className="text-sm font-normal mb-3">My Projects</h2>
          <div className="flex items-center mb-3">
            <Input 
              className="flex-grow mr-2 bg-[#1C1C1C] border-[#272727] hover:bg-[#242424] focus:ring-0 focus:border-[#3A3A3A] transition-colors duration-200" 
              placeholder="Enter project URL"
              value={newProjectUrl}
              onChange={(e) => setNewProjectUrl(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-black hover:bg-[#B9B9B9] hover:text-black transition-colors duration-200"
              onClick={addProject}
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {projects.map((project) => (
              <div 
                key={project.id} 
                className="bg-[#1C1C1C] rounded-md p-3 flex items-center justify-between cursor-pointer"
                onClick={() => {
                  trackReferral(project.id, 'project')
                  window.open(project.url, '_blank')
                }}
              >
                <div className="flex items-center w-full">
                  <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                    {project.image_url ? <img src={project.image_url} alt={project.name} className="w-6 h-6" /> : project.name[0]}
                  </div>
                  <span className="text-white text-sm font-normal flex-grow text-center">{project.name}</span>
                </div>
                <Trash2 
                  className="text-[#7E7E7E] cursor-pointer w-[18px] h-[18px] flex-shrink-0 ml-2 hover:text-white transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteProject(project.id)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 bg-[#161616] p-4 rounded-xl">
          <h2 className="text-sm font-normal mb-3">Stack</h2>
          <div className="flex items-center mb-3">
            <Input 
              className="flex-grow mr-2 bg-[#1C1C1C] border-[#272727] hover:bg-[#242424] focus:ring-0 focus:border-[#3A3A3A] transition-colors duration-200" 
              placeholder="Enter app URL"
              value={newAppUrl}
              onChange={(e) => setNewAppUrl(e.target.value)}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white text-black hover:bg-[#B9B9B9] hover:text-black transition-colors duration-200"
              onClick={addFavoriteApp}
            >
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {favoriteApps.map((app) => (
              <div 
                key={app.id} 
                className="bg-[#1C1C1C] rounded-md p-3 flex items-center justify-between cursor-pointer"
                onClick={() => {
                  trackReferral(app.id, 'app')
                  window.open(app.url, '_blank')
                }}
              >
                <div className="flex items-center w-full">
                  <div className="w-8 h-8 bg-gray-700 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                    {app.image_url ? <img src={app.image_url} alt={app.app_name} className="w-6 h-6" /> : app.app_name[0]}
                  </div>
                  <span className="text-white text-sm font-normal flex-grow text-center">{app.app_name}</span>
                </div>
                <Trash2 
                  className="text-[#7E7E7E] cursor-pointer w-[18px] h-[18px] flex-shrink-0 ml-2 hover:text-white transition-colors duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteFavoriteApp(app.id)
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 bg-[#161616] p-4 rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-normal">Allow messages</span>
            <Switch 
              checked={allowMessages}
              onCheckedChange={(checked) => {
                setAllowMessages(checked)
                updateProfile('allow_messages', checked)
              }}
              className="data-[state=checked]:bg-[#272727]"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .rainbow-border {
          background: linear-gradient(
            45deg,
            #ff0000, #ff9a00, #d0de21, #4fdc4a, #3fdad8, #2fc9e2, #1c7fee, #5f15f2, #ba0cf8, #fb07d9, #ff0000
          );
          background-size: 200% 200%;
          animation: moveGradient 4s linear infinite;
          border-radius: 8px;
          mask: 
            linear-gradient(#fff 0 0) content-box, 
            linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          padding: 2px;
        }
        @keyframes moveGradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  )
}