import { createElement } from "react"
import { Link as LinkIcon } from "lucide-react"
import * as Icons from "lucide-react"

type IndustryIconProps = {
  iconName?: string
  className?: string
}

const getIconComponent = (iconName?: string) => {
  if (!iconName) return LinkIcon

  // Convert kebab-case to PascalCase (e.g., "link-2" -> "Link2")
  const pascalCase = iconName
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")

  // @ts-expect-error - Dynamic icon lookup
  const IconComponent = Icons[pascalCase] as React.ComponentType<{ className?: string }>
  return IconComponent || LinkIcon
}

export const IndustryIcon = ({ iconName, className }: IndustryIconProps) => {
  const IconComponent = getIconComponent(iconName)
  return createElement(IconComponent, { className })
}
