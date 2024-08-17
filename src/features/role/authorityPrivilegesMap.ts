export const authorityPrivilegesMap: { [key: string]: [string, string] } = {
  'user:read': ['Người dùng: Xem', 'blue'],
  'user:update': ['Người dùng: Sửa', 'blue'],
  'user:create': ['Người dùng: Thêm', 'blue'],
  'user:delete': ['Người dùng: Xóa', 'blue'],
  'property:read': ['Bất động sản: Xem', 'magenta'],
  'property:update': ['Bất động sản: Sửa', 'magenta'],
  'property:create': ['Bất động sản: Thêm', 'magenta'],
  'property:delete': ['Bất động sản: Xóa', 'magenta'],
  'review:read': ['Đánh giá: Xem', 'purple'],
  'review:update': ['Đánh giá: Sửa', 'purple'],
  'review:create': ['Đánh giá: Thêm', 'purple'],
  'review:delete': ['Đánh giá: Xóa', 'purple'],
  'city:read': ['Thành phố: Xem', 'volcano'],
  'city:update': ['Thành phố: Sửa', 'volcano'],
  'city:create': ['Thành phố: Thêm', 'volcano'],
  'city:delete': ['Thành phố: Xóa', 'volcano'],
  'district:read': ['Quận huyện: Xem', 'orange'],
  'district:update': ['Quận huyện: Sửa', 'orange'],
  'district:create': ['Quận huyện: Thêm', 'orange'],
  'district:delete': ['Quận huyện: Xóa', 'orange'],
  'room_type:read': ['Loại phòng: Xem', 'gold'],
  'room_type:update': ['Loại phòng: Sửa', 'gold'],
  'room_type:create': ['Loại phòng: Thêm', 'gold'],
  'room_type:delete': ['Loại phòng: Xóa', 'gold'],
  'amenity:read': ['Tiện nghi: Xem', 'lime'],
  'amenity:update': ['Tiện nghi: Sửa', 'lime'],
  'amenity:create': ['Tiện nghi: Thêm', 'lime'],
  'amenity:delete': ['Tiện nghi: Xóa', 'lime'],
  'role:read': ['Vai trò: Xem', 'green'],
  'role:update': ['Vai trò: Sửa', 'green'],
  'role:create': ['Vai trò: Thêm', 'green'],
  'role:delete': ['Vai trò: Xóa', 'green'],
  'admin:all': ['Quản trị: Toàn quyền', 'red'],
  'dashboard:read': ['Dashboard: Xem', 'cyan'],
}

export const RolePrivileges = [
  'Người dùng',
  'Bài đăng',
  'Đánh giá',
  'Thành phố',
  'Quận huyện',
  'Loại phòng',
  'Tiện nghi',
  'Vai trò',
]

interface AuthorityPrivilegesFilterMap {
  text: string;
  value: string;
  children?: AuthorityPrivilegesFilterMap[];
}

const convertToFilterMap = (map: { [key: string]: [string, string] }): AuthorityPrivilegesFilterMap[] => {
  const grouped: { [key: string]: AuthorityPrivilegesFilterMap } = {};

  Object.keys(map).forEach(key => {
    const [prefix] = map[key][0].split(': ');
    if (!grouped[prefix]) {
      grouped[prefix] = {
        text: prefix,
        value: prefix.toLowerCase().replace(/\s+/g, '_'),
        children: []
      };
    }
    grouped[prefix].children!.push({
      text: map[key][0],
      value: key
    });
  });

  return Object.values(grouped);
};

export const authorityPrivilegesFilterMap: AuthorityPrivilegesFilterMap[] = convertToFilterMap(authorityPrivilegesMap);