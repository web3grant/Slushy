// components/ProfileComponent.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { VerifiedIcon, ExternalLinkIcon, ChevronUpIcon, MailIcon } from "lucide-react"
import { TwitterIcon, InstagramIcon, YoutubeIcon, LinkedinIcon } from "lucide-react"

const StatusTag = ({ status }: { status: string }) => {
  const colors: { [key: string]: string } = {
    ACTIVE: "text-green-500",
    ACQUIRED: "text-blue-500",
    DISCONTINUED: "text-red-500"
  }
  return (
    <span className={`${colors[status]} text-xs font-medium`}>
      • {status.toUpperCase()}
    </span>
  )
}

const ProjectCard = ({ icon, name, status = null, url }: { icon: string; name: string; status?: string | null; url: string }) => (
  <div className="bg-[#1C1C1C] hover:bg-[#222121] rounded-xl p-3 flex items-center justify-between group transition-colors duration-200">
    <img src={icon} alt={name} className="w-10 h-10 rounded-xl" />
    <div className="flex-grow text-center">
      <h3 className="text-white text-base font-medium">{name}</h3>
      {status && <StatusTag status={status} />}
    </div>
    <a href={url} target="_blank" rel="noopener noreferrer" className="focus:outline-none">
      <ExternalLinkIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
    </a>
  </div>
)

const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-3">
    <div className="bg-[#161616] rounded-xl p-3">
      <h2 className="text-base font-normal mb-3 px-3">{title}</h2>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  </div>
)

// Define the ProfileType interface here instead of importing it
interface ProfileType {
  avatar: string;
  username: string;
  bio: string;
  social_media_links: Array<{ id: string; url: string; platform: string }>;
  projects: Array<{
    id: string;
    image_url: string;
    name: string;
    status: string;
    url: string;
  }>;
  favorite_apps: Array<{ id: string; image_url: string; app_name: string }>;
}

export default function ProfileComponent({ profile }: { profile: ProfileType }) {
  return (
    <div className="bg-[#111111] text-white">
      <div className="max-w-2xl mx-auto px-4 pb-20 md:px-8 pt-12">
        {/* Profile Section */}
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto border-3 border-white object-cover">
            <AvatarImage src={profile.avatar || "slushy_logo.png"} 
              alt="Profile picture" 
              className="w-full h-full object-cover"
            />
          </Avatar>
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mt-4">
            {profile.username} <VerifiedIcon className="w-5 h-5 text-blue-400" />
          </h1>

          <p className="mt-4 text-[#7E7E7E] text-base font-light px-3">
            {profile.bio}
          </p>
        </div>
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          {profile.social_media_links.map((link: { id: string; url: string; platform: string }) => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-[#7E7E7E] hover:text-white transition-colors">
              {link.platform === 'twitter' && <TwitterIcon className="h-6 w-6" />}
              {link.platform === 'instagram' && <InstagramIcon className="h-6 w-6" />}
              {link.platform === 'youtube' && <YoutubeIcon className="h-6 w-6" />}
              {link.platform === 'linkedin' && <LinkedinIcon className="h-6 w-6" />}
            </a>
          ))}
        </div>

        {/* My Projects Section */}
        <SectionContainer title="My Projects">
          {profile.projects.map((project: {
            id: string;
            image_url: string;
            name: string;
            status: string;
            url: string;
          }) => (
            <ProjectCard 
              key={project.id}
              icon={project.image_url}
              name={project.name}
              status={project.status}
              url={project.url}
            />
          ))}
        </SectionContainer>

        {/* Stack Section */}
        <SectionContainer title="Stack">
          {profile.favorite_apps.map((app: { id: string; image_url: string; app_name: string }) => (
            <ProjectCard 
              key={app.id}
              icon={app.image_url}
              name={app.app_name}
              url="#" // Adding a default URL to satisfy the type requirement
            />
          ))}
        </SectionContainer>

        {/* Leave a message form */}
        <div className="bg-[#1C1C1C] rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <MailIcon className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-normal">Leave a message</h2>
            </div>
            <ChevronUpIcon className="w-5 h-5 text-gray-400" />
          </div>
          <form className="space-y-3">
            <Input type="text" placeholder="Your name" className="bg-[#252525] border-0" />
            <Input type="email" placeholder="Your email" className="bg-[#252525] border-0" />
            <Textarea placeholder="Your message" className="bg-[#252525] border-0" rows={4} />
            <Button className="w-full bg-white text-black hover:bg-gray-200">Send</Button>
          </form>
        </div>
      </div>
    </div>
  )
}