import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import ProductList from './components/ProductList';
import CategoryFilter from './components/CategoryFilter';
import SelectedProductsList from './components/SelectedProductsList';
import TotalDisplay from './components/TotalDisplay';
import CheckoutModal from './components/CheckoutModal'
import CashModal from './components/CashModal'
import TwintModal from './components/TwintModal'
import { Product, SelectedProduct } from './types';
import { sampleProducts } from './data/products';
export function App() {
    const [products] = useState<Product[]>(sampleProducts);
    const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('alle');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false)
    const [isCashModalOpen, setIsCashModalOpen] = useState(false)
    const [isTwintModalOpen, setIsTwintModalOpen] = useState(false)
    const [receiptEmail, setReceiptEmail] = useState<string | undefined>(
        undefined,
    )
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    // Get unique categories from products
    const categories = useMemo(() => {
        const categoriesSet = new Set(products.map(product => product.category));
        return ['alle', ...Array.from(categoriesSet)];
    }, [products]);
    // Filter products based on category and search term
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesCategory = activeCategory === 'alle' || product.category === activeCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [products, activeCategory, searchTerm]);
    // Add product to selected products
    const handleAddProduct = (product: Product) => {
        setSelectedProducts(prev => {
            const existingProduct = prev.find(item => item.id === product.id);
            if (existingProduct) {
                return prev.map(item => item.id === product.id ? {
                    ...item,
                    quantity: item.quantity + 1
                } : item);
            } else {
                return [...prev, {
                    ...product,
                    quantity: 1
                }];
            }
        });
    };
    // Update product quantity
    const handleUpdateQuantity = (id: number, quantity: number) => {
        if (quantity <= 0) {
            handleRemoveProduct(id);
            return;
        }
        setSelectedProducts(prev => prev.map(item => item.id === id ? {
            ...item,
            quantity
        } : item));
    };
    // Remove product from selected products
    const handleRemoveProduct = (id: number) => {
        setSelectedProducts(prev => prev.filter(item => item.id !== id));
    };
    const clearSelectedProducts = () => {
        setSelectedProducts([]);
    };
    const handleOpenCheckoutModal = () => {
        setIsCheckoutModalOpen(true)
    }
    const handleCloseCheckoutModal = () => {
        setIsCheckoutModalOpen(false)
    }
    const handleCloseCashModal = () => {
        setIsCashModalOpen(false)
        setSelectedProducts([])
    }
    const handleCloseTwintModal = () => {
        setIsTwintModalOpen(false)
        setSelectedProducts([])
    }
    const handleCheckout = (method: string, email?: string) => {
        setReceiptEmail(email)
        handleCloseCheckoutModal()
        console.log("LOG CHECKOUT")
        if (method === 'cash') {
            setIsCashModalOpen(true)
        } else {
            setIsTwintModalOpen(true)
        }
        console.log("SEND RECEIPT")
    }
    // Calculate totals for checkout modal
    const { subtotal, itemCount } = useMemo(() => {
        const subtotal = selectedProducts.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
        )
        const itemCount = selectedProducts.reduce(
            (count, product) => count + product.quantity,
            0,
        )
        return {
            subtotal,
            itemCount,
        }
    }, [selectedProducts])
    return <div className="flex flex-col min-h-screen md:max-h-screen bg-gray-100 w-full">
        <header className="bg-blue-600 text-white p-4 shadow-md">
            <h1 className="text-2xl font-bold">Simple Checkout System</h1>
        </header>
        <main className="flex flex-col md:flex-row flex-1 h-full p-4 gap-4 overflow-y-hidden">
            {/* Left side - Product selection */}
            <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4 overflow-hidden">
                <div className="mb-4 flex flex-col sm:flex-row gap-4">
                    {/* Search bar */}
                    <div className="relative flex-1">
                        <input type="text" placeholder="Produkte suchen..." className="w-full p-2 pl-10 border border-gray-300 rounded-md" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    {/* Category filter */}
                    <CategoryFilter categories={categories} activeCategory={activeCategory} onSelectCategory={setActiveCategory} />
                </div>
                <div className="relative md:bottom-[60px] h-[calc(100%-60px)] md:mt-[76px] overflow-y-scroll"> {/* todo Ew fix it */}
                    {/* Product list */}
                    <ProductList products={filteredProducts} onAddProduct={handleAddProduct} />
                </div>
            </div>
            {/* Right side - Selected products and total */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="bg-white rounded-lg shadow-md p-4 flex-1">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Ausgewählte Produkte</h2>
                        {selectedProducts.length > 0 && (
                            <button className="m-0 underline text-red-500 text-sm" onClick={clearSelectedProducts} aria-label="Alle löschen">
                                Alle löschen
                            </button>
                        )}
                    </div>
                    <SelectedProductsList selectedProducts={selectedProducts} onUpdateQuantity={handleUpdateQuantity} onRemoveProduct={handleRemoveProduct} />
                </div>
                <TotalDisplay selectedProducts={selectedProducts} onCompleteSale={handleOpenCheckoutModal} />
            </div>
        </main>
        <CheckoutModal isOpen={isCheckoutModalOpen} onClose={handleCloseCheckoutModal} total={subtotal} itemCount={itemCount} onCheckout={handleCheckout} />
        <CashModal isOpen={isCashModalOpen} onClose={handleCloseCashModal} total={subtotal} email={receiptEmail} />
        <TwintModal isOpen={isTwintModalOpen} onClose={handleCloseTwintModal} total={subtotal} email={receiptEmail} />
    </div>;
}
