export interface Product {
  id: number
  name: string
  price: number
  category: string
}
export interface SelectedProduct extends Product {
  quantity: number
}
