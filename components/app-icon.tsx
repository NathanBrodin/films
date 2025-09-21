import React from "react"

import Icon34 from "./logos/icon-34"

interface AppIconProps {
  className?: string
  size?: number
}

export const AppIcon: React.FC<AppIconProps> = ({
  className = "",
  size = 24,
}) => {
  return <Icon34 size={size} className={className} />
}

export default AppIcon
