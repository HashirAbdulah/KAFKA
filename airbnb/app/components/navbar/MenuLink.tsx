'use client';

interface MenuLinkProps {
    label: string;
    onClick: () => void;
}

const MenuLink: React.FC <MenuLinkProps>= ({label, onClick}) => {
  return (
    <div
    onClick={onClick}
    className="px-4 py-3 hover:bg-gray-200 transition cursor-pointer">
    {label}
    </div>
  )
}

export default MenuLink;
