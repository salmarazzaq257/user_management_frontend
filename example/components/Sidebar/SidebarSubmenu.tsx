import React, { useState, useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { DropdownIcon, IIcon } from 'icons'
import * as Icons from 'icons'
import { Transition } from '@roketid/windmill-react-ui'
import { IRoute, routeIsActive } from 'routes/sidebar'
import SidebarContext from 'context/SidebarContext'

function Icon({ icon, ...props }: IIcon) {
  // @ts-ignore
  const _Icon = Icons[icon]
  return <_Icon {...props} />
}

interface ISidebarSubmenu {
  route: IRoute
  linkClicked: () => void
}

function SidebarSubmenu({ route, linkClicked }: ISidebarSubmenu) {
  const { pathname } = useRouter()
  const { saveScroll } = useContext(SidebarContext)

  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(
    route.routes
    ? route.routes.filter((r) => {
        return routeIsActive(pathname, r)
      }).length > 0
    : false
  )


  return (
    <li className="relative px-6 py-3" key={route.name}>

        <ul
          className="p-2 mt-2 space-y-2 overflow-hidden text-sm font-medium text-gray-500 rounded-md shadow-inner bg-gray-50 dark:text-gray-400 dark:bg-gray-900"
          aria-label="submenu"
        >
          {
            route.routes && route.routes.map((r) => (
              <li
                className="px-2 py-1 transition-colors duration-150 hover:text-gray-800 dark:hover:text-gray-200"
                key={r.name}
              >
                <Link
                  href={`/example/forgot-password` }
                  
                >
                 
                    {r.name}
               
                </Link>
              </li>
            ))
          }
        </ul>

    </li>
  )
}

export default SidebarSubmenu
