import React, { useState } from 'react'
import { XIcon, CreditCardIcon, BanknoteIcon } from 'lucide-react'
interface CheckoutModalProps {
    isOpen: boolean
    onClose: () => void
    total: number
    itemCount: number
    onCheckout: (method: string, email?: string) => void
}
const CheckoutModal: React.FC<CheckoutModalProps> = ({
    isOpen,
    onClose,
    total,
    itemCount,
    onCheckout,
}) => {
    const [email, setEmail] = useState('')
    const [isValidEmail, setIsValidEmail] = useState(true)
    if (!isOpen) return null
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEmail(value)
        // Simple email validation
        if (value === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            setIsValidEmail(true)
        } else {
            setIsValidEmail(false)
        }
    }
    const handleCheckout = (method: string) => {
        // Only validate email if it's not empty
        if (email && !isValidEmail) return
        onCheckout(method, email || undefined)
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold">Complete Your Purchase</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <div className="mb-6">
                        <p className="mb-4">
                            You're about to complete a purchase of {itemCount}{' '}
                            {itemCount === 1 ? 'item' : 'items'} for a total of{' '}
                            <span className="font-bold">${total.toFixed(2)}</span>.
                        </p>
                        <p className="text-gray-600">
                            Please select your preferred payment method below. If you'd like
                            to receive a receipt, enter your email address.
                        </p>
                    </div>
                    <div className="mb-6">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium">
                            Email for receipt (optional)
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="your@email.com"
                            className={`w-full p-2 border rounded-md ${!isValidEmail ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {!isValidEmail && (
                            <p className="mt-1 text-sm text-red-500">
                                Please enter a valid email address
                            </p>
                        )}
                    </div>
                    <div className="space-y-4">
                        <h3 className="font-medium">Select payment method:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => handleCheckout('card')}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                disabled={email !== '' && !isValidEmail}
                            >
                                <CreditCardIcon size={18} />
                                Pay with Card
                            </button>
                            <button
                                onClick={() => handleCheckout('cash')}
                                className="flex items-center justify-center gap-2 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors"
                                disabled={email !== '' && !isValidEmail}
                            >
                                <BanknoteIcon size={18} />
                                Pay with Cash
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
export default CheckoutModal

