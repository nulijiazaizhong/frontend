"use client";

import dynamic from 'next/dynamic'

export const JoyRideNoSSR = dynamic(
    () => import('react-joyride'),
    { ssr: false }
)

export const skipAll = () => {
    localStorage.setItem("hasDoneOnboarding", "true");
    localStorage.setItem("hasDoneSettingsOnboarding", "true");
    localStorage.setItem("hasDonePluginsOnboarding", "true");
}

export const resetAll = () => {
    localStorage.removeItem("hasDoneOnboarding");
    localStorage.removeItem("hasDoneSettingsOnboarding");
    localStorage.removeItem("hasDonePluginsOnboarding");
}