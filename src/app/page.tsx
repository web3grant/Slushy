"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { VerifiedIcon, ExternalLinkIcon, ChevronUpIcon, MailIcon } from "lucide-react"
import { TwitterIcon, InstagramIcon, YoutubeIcon, LinkedinIcon } from "lucide-react"



import { DynamicWidget } from "@dynamic-labs/sdk-react-core"

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

const ProjectCard = ({ icon, name, status = null }: { icon: string; name: string; status?: string | null }) => (
  <div className="bg-[#1C1C1C] hover:bg-[#222121] rounded-xl p-3 flex items-center justify-between group transition-colors duration-200">
     <div className="mb-4">
          
        </div>
    <img src={icon} alt={name} className="w-10 h-10 rounded-xl" />
    <div className="flex-grow text-center">
      <h3 className="text-white text-base font-medium">{name}</h3>
      {status && <StatusTag status={status} />}
    </div>
    <button className="focus:outline-none">
      <ExternalLinkIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
    </button>
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

import { useDynamicContext } from "@dynamic-labs/sdk-react-core"

export default function Component() {
  const { user, isAuthenticated } = useDynamicContext()

  return (
    <div className="bg-[#111111] text-white">
      <div className="max-w-2xl mx-auto px-4 pb-20 md:px-8 pt-12">
        <div className="mb-4">
          <DynamicWidget />
        </div>
        {isAuthenticated ? (
          <p className="text-center mb-4">Welcome, {user?.email || 'User'}!</p>
        ) : (
          <p className="text-center mb-4"></p>
        )}
        {/* Profile Section */}
        <div className="text-center mb-8">
          <Avatar className="w-32 h-32 mx-auto border-3 border-white object-cover">
            <AvatarImage src="slushy_logo.png" 
              alt="Profile picture" 
              className="w-full h-full object-cover"
            />
          </Avatar>
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mt-4">
            Slushy <VerifiedIcon className="w-5 h-5 text-blue-400" />
          </h1>
          
          <p className="mt-4 text-[#7E7E7E] text-base font-light px-3">
            Building shit in defi that I think is cool. Follow along all of my projects and check out the AI tools I am using to scale my businesses.
          </p>
        </div>
        {/* Social Media Icons */}
        <div className="flex justify-center space-x-6 mb-6">
          <button className="text-[#7E7E7E] hover:text-white transition-colors">
            <TwitterIcon className="h-6 w-6" />
          </button>
          <button className="text-[#7E7E7E] hover:text-white transition-colors">
            <InstagramIcon className="h-6 w-6" />
          </button>
          <button className="text-[#7E7E7E] hover:text-white transition-colors">
            <YoutubeIcon className="h-6 w-6" />
          </button>
          <button className="text-[#7E7E7E] hover:text-white transition-colors">
            <LinkedinIcon className="h-6 w-6" />
          </button>
        </div>


        {/* My Projects Section */}
        <SectionContainer title="My Projects">
          <ProjectCard icon="product1.png" name="Interior AI" status="ACTIVE" />
          <ProjectCard icon="product2.png" name="Penpal AI" status="ACTIVE" />
          <ProjectCard icon="product3.png" name="Intovid" status="ACQUIRED" />
          <ProjectCard icon="product4.png" name="Recruiter AI" status="DISCONTINUED" />
        </SectionContainer>

        {/* Stack Section */}
        <SectionContainer title="Stack">
          <ProjectCard icon="product3.png" name="Interior AI" />
          <ProjectCard icon="product1.png" name="Penpal AI" />
          <ProjectCard icon="product4.png" name="Intovid" />
          <ProjectCard icon="product2.png" name="Recruiter AI" />
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