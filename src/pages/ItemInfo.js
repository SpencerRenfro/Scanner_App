import SingleItemData from './SingleItemData'

function ItemInfo({ setHideNavbar }) {
  return (
    <div className="bg-slate-100 dark:bg-gray-900 min-h-screen">
      <SingleItemData setHideNavbar={setHideNavbar} />
    </div>
  )
}

export default ItemInfo