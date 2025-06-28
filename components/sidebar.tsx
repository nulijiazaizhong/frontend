import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarGroupAction,
    SidebarMenuButton,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarRail
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import { CheckForUpdate, GetMetadata } from "@/apis/backend"

import { useProgress } from "react-transition-progress"
import { startTransition } from "react"
import { translate } from "@/apis/translation"
import { 
    ChevronUp, 
    House,
    TvMinimal,
    ChartNoAxesGantt,
    ChartArea,
    BookText,
    MessageSquare,
    Bolt,
    UserCog,
    UserRoundMinus,
    ArrowLeftToLine,
} from "lucide-react"

import { SetSettingByKey } from "@/apis/settings"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { useAuth } from '@/apis/auth'
import { Button } from "./ui/button"
import { GetDevmode, ReloadPlugins } from "@/apis/backend"
import { toast } from "sonner"
import useSWR from "swr"
import RenderPage from "./page/render_page"

export function ETS2LASidebar() {
    const { data: update_data } = useSWR("update", CheckForUpdate, { refreshInterval: 60000 })
    const { data: devmode } = useSWR("devmode", GetDevmode)
    const { data: metadata } = useSWR("metadata", GetMetadata)
    const { token, username, setToken, setUsername } = useAuth()
    const startProgress = useProgress()
    const router = useRouter()
    const path = usePathname()
    const params = useSearchParams()
    const { theme } = useTheme();

    const buttonClassName = (targetPath: string, targetQuery?: { [key: string]: string }) => {
        if (targetQuery) {
            const currentUrl = params.get('url')
            const targetUrl = targetQuery.url
            
            if (path === targetPath && currentUrl === targetUrl) {
                return "font-medium bg-secondary transition-all hover:shadow-md active:scale-95 duration-200"
            }
        } else if (path === targetPath) {
            // For paths without query parameters, just check the path
            return "font-medium bg-secondary transition-all hover:shadow-md active:scale-95 duration-200"
        }
        
        return "font-medium transition-all hover:shadow-md active:scale-95 duration-200"
    }

    return (
        <Sidebar className="border-none font-geist" variant="inset" id="sidebar" >
            <SidebarHeader className="bg-sidebarbg w-full">
                <div className="flex flex-col gap-4 items-center w-full" id="sidebar_header">
                    <div className="flex flex-col gap-1 w-full">
                        <p className="text-sm font-semibold pl-2 cursor-pointer" onMouseDown={() => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/about')
                            })
                        }}>ETS2LA</p>
                        <p className="text-xs pl-2 font-semibold text-muted-foreground cursor-pointer" onMouseDown={() => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/page?url=/changelog')
                            })
                        }}>{metadata && "v" + metadata.version || "ERROR: please refresh the page or purge .next/cache"}</p>
                    </div>
                    { update_data && 
                        <Button size={"sm"} variant={"outline"} className="w-full" onMouseDown={() => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/page?url=/updater')
                            })
                        }}>
                            {translate("frontend.sidebar.updates_available")}
                        </Button>
                    }
                </div>
            </SidebarHeader>
            <SidebarContent className="bg-sidebarbg custom-scrollbar" >
                <SidebarGroup>
                    <SidebarGroupLabel className="font-semibold" >
                        {translate("frontend.sidebar.main")}
                    </SidebarGroupLabel>
                    <SidebarMenuButton className={buttonClassName("/about")} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/about')
                            })
                        }
                    }>
                        <House /> {translate("frontend.sidebar.dashboard")}
                    </SidebarMenuButton>
                    <SidebarMenuButton className={buttonClassName("/visualization")} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/visualization')
                            })
                        }
                    }>
                        <TvMinimal /> {translate("frontend.sidebar.visualization")}
                    </SidebarMenuButton>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-semibold">
                        {translate("frontend.sidebar.plugins")}
                    </SidebarGroupLabel>
                    <SidebarMenuButton className={buttonClassName("/page", { url: "/plugins" })} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/page?url=/plugins')
                            })
                        }
                    }>
                        <ChartNoAxesGantt /> {translate("frontend.sidebar.manager")}
                    </SidebarMenuButton>
                    <SidebarMenuButton className={buttonClassName("/page", { url: "/performance" })} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/page?url=/performance')
                            })
                        }
                    }>
                        <ChartArea /> {translate("frontend.sidebar.performance")}
                    </SidebarMenuButton>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel className="font-semibold">
                        {translate("frontend.sidebar.help")}
                    </SidebarGroupLabel>
                    <SidebarMenuButton className={buttonClassName("/wiki")} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/wiki')
                            })
                        }
                    }>
                        <BookText /> {translate("frontend.sidebar.wiki")}
                    </SidebarMenuButton>
                    <SidebarMenuButton className={buttonClassName("/page", { url: "/chat" })} onMouseDown={
                        () => {
                            startTransition(async () => {
                                startProgress()
                                router.push('/page?url=/chat')
                            })
                        }
                    }>
                        <MessageSquare /> {translate("frontend.sidebar.chat")}
                    </SidebarMenuButton>
                </SidebarGroup>
                {devmode && (
                    <SidebarGroup>
                        <SidebarGroupLabel className="font-semibold">
                            Developers
                        </SidebarGroupLabel>
                        <SidebarMenuButton className={buttonClassName("/wiki")} onMouseDown={
                            () => {
                                ReloadPlugins()
                                toast.success("Reloaded plugin data")
                            }
                        }>
                            Reload Plugin Data
                        </SidebarMenuButton>
                        <SidebarMenuButton className={buttonClassName("/page", { url: "/telemetry" })} onMouseDown={
                            () => {
                                startTransition(async () => {
                                    startProgress()
                                    router.push('/page?url=/telemetry')
                                })
                            }
                        }>
                            Telemetry
                        </SidebarMenuButton>
                        <SidebarMenuButton className={buttonClassName("/wiki")} onMouseDown={
                            () => {
                                startTransition(async () => {
                                    startProgress()
                                    router.push('/onboarding')
                                })
                            }
                        }>
                            Onboarding
                        </SidebarMenuButton>
                    </SidebarGroup> 
                )}
            </SidebarContent>
            
            <SidebarRail className="z-999" id="sidebar_rail" />
            <SidebarFooter className="bg-sidebarbg pb-10">
                <div>
                    <SidebarMenuButton className={buttonClassName("/settings")} onMouseDown={
                            () => {
                                startTransition(async () => {
                                    startProgress()
                                    router.push('/settings')
                                })
                            }
                        } id="settings" >
                        <Bolt /> {translate("frontend.sidebar.settings")}
                    </SidebarMenuButton>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-full">
                                    <SidebarMenuButton className="w-full flex justify-between hover:shadow-md transition-all">
                                        <div className="flex items-center gap-2">
                                            {token == "" ?
                                                <span>{translate("frontend.sidebar.anonymous")}</span>
                                                :
                                                <span>{username}</span>
                                            }
                                        </div>
                                        <ChevronUp className="w-4 h-4 justify-self-end" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="bg-transparent backdrop-blur-lg backdrop-brightness-75 w-48"
                                >
                                    {token == "" ?
                                        <DropdownMenuItem onMouseDown={
                                            () => {
                                                startTransition(async () => {
                                                    startProgress()
                                                    router.push('/login')
                                                })
                                            }
                                        }>
                                            <ArrowLeftToLine size={20} /> <span>{translate("frontend.sidebar.sign_in")}</span>
                                        </DropdownMenuItem>
                                        :
                                        <>
                                            <DropdownMenuItem>
                                                <UserCog size={20} /> <span>{translate("frontend.sidebar.account")}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onMouseDown={
                                                () => {
                                                    SetSettingByKey("global", "token", "")
                                                    SetSettingByKey("global", "user_id", "")
                                                    setToken("")
                                                    setUsername("")
                                                    toast.success(translate("frontend.sidebar.sign_out_successful"), { description: translate("frontend.sidebar.sign_out_description") })
                                                }
                                            }>
                                                <UserRoundMinus /> <span>{translate("frontend.sidebar.sign_out")}</span>
                                            </DropdownMenuItem>
                                        </>
                                    }
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
                <div id="ram_usage" className="w-full h-10 -my-8 mt-0">
                    <RenderPage url="/stats" className="w-full" container_classname="overflow-y-hidden" />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
  