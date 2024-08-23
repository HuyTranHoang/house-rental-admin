const CITY_BASE = '/thanh-pho'
const DISTRICT_BASE = '/quan-huyen'
const ROOM_TYPE_BASE = '/loai-phong'
const AMENITY_BASE = '/tien-ich'

const ROUTER_NAMES = {
  DASHBOARD: '/',
  LOGIN: '/dang-nhap',

  CITY: `${CITY_BASE}`,
  ADD_CITY: `${CITY_BASE}/them-moi`,
  DETAIL_CITY: `${CITY_BASE}/:id`,
  EDIT_CITY: `${CITY_BASE}/:id/cap-nhat`,

  DISTRICT: `${DISTRICT_BASE}`,
  ADD_DISTRICT: `${DISTRICT_BASE}/them-moi`,
  DETAIL_DISTRICT: `${DISTRICT_BASE}/:id`,
  EDIT_DISTRICT: `${DISTRICT_BASE}/:id/cap-nhat`,

  ROOM_TYPE: `${ROOM_TYPE_BASE}`,
  ADD_ROOM_TYPE: `${ROOM_TYPE_BASE}/them-moi`,
  DETAIL_ROOM_TYPE: `${ROOM_TYPE_BASE}/:id`,
  EDIT_ROOM_TYPE: `${ROOM_TYPE_BASE}/:id/cap-nhat`,

  AMENITY: `${AMENITY_BASE}`,
  ADD_AMENITY: `${AMENITY_BASE}/them-moi`,
  DETAIL_AMENITY: `${AMENITY_BASE}/:id`,
  EDIT_AMENITY: `${AMENITY_BASE}/:id/cap-nhat`,

  REPORT: '/bao-cao-vi-pham',

  ROLE: '/vai-tro',

  REVIEW: '/danh-gia',

  USER: '/nguoi-dung',

  PROPERTY: '/bat-dong-san',

  getCityEditPath: (id: string | number) => `${CITY_BASE}/${id}/cap-nhat`,
  getDistrictEditPath: (id: string | number) => `${DISTRICT_BASE}/${id}/cap-nhat`,
  getRoomTypeEditPath: (id: string | number) => `${ROOM_TYPE_BASE}/${id}/cap-nhat`,
  getAmenityEditPath: (id: string | number) => `${AMENITY_BASE}/${id}/cap-nhat`
}

export default ROUTER_NAMES
