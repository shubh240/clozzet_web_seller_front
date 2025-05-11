export const MENU_ITEMS = [
  {
    key: 'menu',
    label: 'MENU',
    isTitle: true,
  },
  {
    key: 'dashboard',
    icon: 'solar:home-2-broken',
    label: 'Dashboard',
    url: '/dashboard',
  },
  {
    key: 'category',
    icon: 'solar:layers-outline',

    label: 'Category',
    url: '/categories',
  },
  {
    key: 'sizeChart',
    icon: 'solar:layers-outline',

    label: 'SizeChart',
    url: '/sizeCharts',
  },
  {
    key: 'menuitem',
    icon: 'solar:share-broken',
    label: 'Menu Item',
    children: [
      {
        key: 'menu-item-1',
        label: 'Menu Item 1',
        parentKey: 'menuitem',
      },
      {
        key: 'menu-item-2',
        label: 'Menu Item 2',
        parentKey: 'menuitem',
        children: [
          {
            key: 'menu-sub-item',
            label: 'Menu Sub Item',
            parentKey: 'menu-item-2',
          },
        ],
      },
    ],
  },
]
