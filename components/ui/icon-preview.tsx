"use client";

import React from "react";

// Dynamically load icons by prefix without importing entire libraries
// Supported prefixes: Io5, Fa, Md, Ri, Io, Pi, Gi
const prefixToPackage: Array<{ prefix: string; pkg: string }> = [
  { prefix: "Io5", pkg: "react-icons/io5" },
  { prefix: "Fa", pkg: "react-icons/fa" },
  { prefix: "Md", pkg: "react-icons/md" },
  { prefix: "Ri", pkg: "react-icons/ri" },
  { prefix: "Io", pkg: "react-icons/io" },
  { prefix: "Pi", pkg: "react-icons/pi" },
  { prefix: "Gi", pkg: "react-icons/gi" },
];

type AnyIcon = React.ComponentType<{ className?: string }>;

// Simple in-memory cache so repeated icons don't re-import
const iconCache = new Map<string, AnyIcon | null>();

async function loadIcon(iconName: string): Promise<AnyIcon | null> {
  if (iconCache.has(iconName)) return iconCache.get(iconName) ?? null;

  // Match the longest prefix first (e.g., Io5 before Io)
  const entry = prefixToPackage.find(({ prefix }) => iconName.startsWith(prefix));
  if (!entry) {
    iconCache.set(iconName, null);
    return null;
  }

  try {
    const mod = await import(/* webpackChunkName: "icon-[request]" */ entry.pkg);
    const Icon = (mod as Record<string, AnyIcon>)[iconName];
    const resolved = Icon ?? null;
    iconCache.set(iconName, resolved);
    return resolved;
  } catch {
    iconCache.set(iconName, null);
    return null;
  }
}

export const IconPreview = React.memo(({ iconName, className = "h-6 w-6" }: { iconName: string; className?: string }) => {
  const [IconComp, setIconComp] = React.useState<AnyIcon | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    setIconComp(null);
    loadIcon(iconName).then((comp) => {
      if (isMounted) setIconComp(comp);
    });
    return () => {
      isMounted = false;
    };
  }, [iconName]);

  if (!IconComp) {
    return <span className="text-gray-500 text-sm">{" "}</span>;
  }

  return <IconComp className={className} />;
});

IconPreview.displayName = "IconPreview";

// Small curated list for suggestions (kept lightweight). Users can still type any valid icon name.
const curatedIconNames = [
  "FaHome", "FaUser", "FaShoppingCart", "FaHeart", "FaStar", "FaSearch", "FaPlus", "FaMinus", "FaEdit", "FaTrash",
  "MdHome", "MdPerson", "MdShoppingCart", "MdFavorite", "MdStar", "MdSearch", "MdAdd", "MdRemove", "MdEdit", "MdDelete",
  "RiHomeLine", "RiUserLine", "RiShoppingCartLine", "RiHeartLine", "RiStarLine", "RiSearchLine", "RiAddLine", "RiSubtractLine", "RiEditLine", "RiDeleteBinLine",
  "IoHome", "IoPerson", "IoCart", "IoHeart", "IoStar", "IoSearch",
  "Io5Home", "Io5Person", "Io5Cart", "Io5Heart", "Io5Star", "Io5Search",
  "PiHouse", "PiUser", "PiShoppingCart", "PiHeart", "PiStar", "PiMagnifyingGlass",
  "GiKnife", "GiHamburger", "GiCakeSlice", "GiCoffeeCup", "GiFireDash"
];

export const getAllIconNames = () => curatedIconNames;

// Lightweight keyword → icon names mapping to support natural searches
// Note: Not exhaustive; add more keys over time as needed
const keywordIndex: Record<string, string[]> = {
  // apparel
  "dress": ["GiDress", "FaTshirt", "RiTShirt2Line", "MdCheckroom", "RiShirtLine"],
  "handbag": ["RiHandbagLine", "FaShoppingBag", "MdLocalMall", "RiShoppingBagLine", "MdShoppingBag"],
  "bag": ["RiHandbagLine", "FaShoppingBag", "MdLocalMall", "RiShoppingBagLine", "MdShoppingBag", "MdBackpack"],
  "shirt": ["FaTshirt", "RiTShirt2Line", "RiShirtLine", "MdCheckroom"],
  "clothes": ["FaTshirt", "MdCheckroom", "RiTShirt2Line", "GiDress"],
  "fashion": ["GiDress", "FaTshirt", "RiHandbagLine", "MdLocalMall"],
  // shopping
  "mall": ["MdLocalMall", "FaShoppingBag"],
  "shopping": ["FaShoppingCart", "RiShoppingCartLine", "FaShoppingBag", "RiShoppingBagLine"],
};

export const useFilteredIcons = (search: string) => {
  return React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return curatedIconNames;

    const set = new Set<string>();
    // matches by icon name
    curatedIconNames.forEach((name) => {
      if (name.toLowerCase().includes(q)) set.add(name);
    });
    // matches by keyword mapping
    Object.entries(keywordIndex).forEach(([keyword, names]) => {
      if (keyword.includes(q) || q.includes(keyword)) {
        names.forEach((n) => set.add(n));
      }
    });

    return Array.from(set).slice(0, 50);
  }, [search]);
};
