export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: "cookies" | "brownies"
  image: string
  featured?: boolean
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic Chocolate Chip",
    description: "Our signature cookie with premium chocolate chips and a perfect golden crisp",
    price: 12.99,
    category: "cookies",
    image: "/chocolate-chip-cookies.png",
    featured: true,
  },
  {
    id: "2",
    name: "Double Fudge Brownie",
    description: "Rich, dense, and utterly chocolatey with a fudgy center",
    price: 14.99,
    category: "brownies",
    image: "/fudge-brownies.jpg",
    featured: true,
  },
  {
    id: "3",
    name: "Pink Sugar Cookies",
    description: "Soft and buttery cookies with pink vanilla icing and rainbow sprinkles",
    price: 11.99,
    category: "cookies",
    image: "/pink-sugar-cookies.jpg",
    featured: true,
  },
  {
    id: "4",
    name: "Salted Caramel Brownie",
    description: "Gooey brownies swirled with caramel and topped with sea salt",
    price: 15.99,
    category: "brownies",
    image: "/salted-caramel-brownies.jpg",
    featured: true,
  },
  {
    id: "5",
    name: "Oatmeal Raisin",
    description: "Hearty oats, plump raisins, and warm cinnamon in every bite",
    price: 10.99,
    category: "cookies",
    image: "/oatmeal-raisin-cookies.png",
  },
  {
    id: "6",
    name: "White Chocolate Macadamia",
    description: "Buttery cookies loaded with white chocolate and macadamia nuts",
    price: 13.99,
    category: "cookies",
    image: "/white-chocolate-macadamia-cookies.jpg",
  },
  {
    id: "7",
    name: "Peanut Butter Cup Brownie",
    description: "Decadent brownies studded with peanut butter cups",
    price: 15.99,
    category: "brownies",
    image: "/peanut-butter-cup-brownies.jpg",
  },
  {
    id: "8",
    name: "Lemon Lavender Cookie",
    description: "Delicate citrus cookies with a hint of lavender",
    price: 12.99,
    category: "cookies",
    image: "/lemon-lavender-cookies.jpg",
  },
  {
    id: "9",
    name: "Triple Chocolate Brownie",
    description: "Dark, milk, and white chocolate in one indulgent treat",
    price: 16.99,
    category: "brownies",
    image: "/triple-chocolate-brownies.jpg",
  },
  {
    id: "10",
    name: "Snickerdoodle",
    description: "Soft cinnamon sugar cookies with a delightful chewy texture",
    price: 11.99,
    category: "cookies",
    image: "/snickerdoodle-cookies.png",
  },
  {
    id: "11",
    name: "Raspberry Swirl Brownie",
    description: "Fudgy brownies with tangy raspberry swirls",
    price: 15.99,
    category: "brownies",
    image: "/raspberry-swirl-brownies.jpg",
  },
  {
    id: "12",
    name: "Matcha White Chocolate",
    description: "Earthy matcha cookies with sweet white chocolate chunks",
    price: 13.99,
    category: "cookies",
    image: "/matcha-white-chocolate-cookies.jpg",
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: "cookies" | "brownies"): Product[] {
  return products.filter((p) => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}
