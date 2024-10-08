import ROUTER_NAMES from '@/constant/routerNames.ts'
import { User } from '@/types/user.type.ts'
import { MenuProps } from 'antd'

type MenuItems = Required<MenuProps>['items']

const hasAuthority = (currentUser: User | null, authority: string) => {
  return currentUser?.authorities.includes(authority) || currentUser?.roles.includes('ROLE_ADMIN')
}

const filterMenuItems = (items: MenuItems, currentUser: User | null): MenuItems => {
  if (!items) return []

  return items.reduce<MenuItems>((acc, item) => {
    if (!item) return acc

    if ('children' in item && item.children) {
      const filteredChildren = filterMenuItems(item.children, currentUser)
      if (filteredChildren.length > 0) {
        acc.push({
          ...item,
          children: filteredChildren
        })
      }
    } else if ('key' in item) {
      switch (item.key) {
        case ROUTER_NAMES.TRANSACTION:
          if (hasAuthority(currentUser, 'transaction:read')) acc.push(item)
          break
        case ROUTER_NAMES.MEMBER_SHIP:
          if (hasAuthority(currentUser, 'membership:read')) acc.push(item)
          break
        case ROUTER_NAMES.PROPERTY:
          if (hasAuthority(currentUser, 'property:read')) acc.push(item)
          break
        case ROUTER_NAMES.REPORT:
          if (hasAuthority(currentUser, 'report:read')) acc.push(item)
          break
        case ROUTER_NAMES.CITY:
          if (hasAuthority(currentUser, 'city:read')) acc.push(item)
          break
        case ROUTER_NAMES.DISTRICT:
          if (hasAuthority(currentUser, 'district:read')) acc.push(item)
          break
        case ROUTER_NAMES.ROOM_TYPE:
          if (hasAuthority(currentUser, 'roomType:read')) acc.push(item)
          break
        case ROUTER_NAMES.AMENITY:
          if (hasAuthority(currentUser, 'amenity:read')) acc.push(item)
          break
        case ROUTER_NAMES.COMMENT:
          if (hasAuthority(currentUser, 'comment:read')) acc.push(item)
          break
        case ROUTER_NAMES.COMMENT_REPORT:
          if (hasAuthority(currentUser, 'commentReport:read')) acc.push(item)
          break
        case ROUTER_NAMES.USER:
          if (hasAuthority(currentUser, 'user:read')) acc.push(item)
          break
        case ROUTER_NAMES.ROLE:
          if (hasAuthority(currentUser, 'role:read')) acc.push(item)
          break
        case ROUTER_NAMES.ADVERTISEMENT:
          if (hasAuthority(currentUser, 'advertisement:read')) acc.push(item)
          break
        default:
          acc.push(item)
      }
    }

    return acc
  }, [])
}

export default filterMenuItems
