import { useEffect, useState } from 'react'
import api from '../api'
import Message from '../components/Message'

// POS Sistemi için Satış Ekranı
const MainPOS = () => {
    // State Tanımları
    const [products, setProducts] = useState([]) // Tüm ürünler
    const [basket, setBasket] = useState<{ product: any, count: number }[]>([]) // Sepet
    const [searchTerm, setSearchTerm] = useState('') // Arama
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false) // Satış işlemi sırası
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = () => {
        setLoading(true)
        api.get('/inventory/medicines/')
            .then(response => {
                setProducts(response.data)
                setLoading(false)
            })
            .catch(error => {
                console.error('Veri çekme hatası:', error)
                setLoading(false)
            })
    }

    // Sepete Ekle
    const addToBasket = (product: any) => {
        // Stok kontrolü (İsteğe bağlı, şimdilik sadece görsel uyarı verebiliriz)
        if (product.how_many <= 0) {
            if (product.how_many <= 0) {
                setMessageData({ type: 'warning', message: 'Bu ürün stokta yok!' })
                return;
            }
        }

        setBasket(prev => {
            const existing = prev.find(item => item.product.id === product.id)
            if (existing) {
                // Eğer sepetteki miktar stoktan fazlaysa uyarı ver
                if (existing.count >= product.how_many) {
                    if (existing.count >= product.how_many) {
                        setMessageData({ type: 'warning', message: 'Yetersiz stok!' })
                        return prev;
                    }
                }
                return prev.map(item =>
                    item.product.id === product.id ? { ...item, count: item.count + 1 } : item
                )
            }
            return [...prev, { product, count: 1 }]
        })
    }

    // Sepetten Çıkar
    const removeFromBasket = (productId: number) => {
        setBasket(prev => prev.filter(item => item.product.id !== productId))
    }

    // Miktar Azalt
    const decreaseQuantity = (productId: number) => {
        setBasket(prev => {
            return prev.map(item => {
                if (item.product.id === productId) {
                    return item.count > 1 ? { ...item, count: item.count - 1 } : item
                }
                return item
            })
        })
    }

    // Satışı Tamamla
    const handleCheckout = async () => {
        if (basket.length === 0) return;

        setProcessing(true);

        try {
            // Backend'in beklediği formatı hazırlıyoruz
            const payload = {
                items: basket.map(item => ({
                    product_id: item.product.id,
                    quantity: item.count
                }))
            };

            // API'ye POST isteği at
            const response = await api.post('/sales/checkout/', payload);

            // Başarılı olursa
            console.log("Satış başarılı:", response.data);
            console.log("Satış başarılı:", response.data);
            setMessageData({ type: 'success', title: 'Satış Başarılı!', message: `Satış ID: #${response.data.sale_id}\nToplam Tutar: ₺${response.data.total}` });

            setBasket([]); // Sepeti temizle
            fetchProducts(); // Stokları güncelle (Backend'den yeni halini çek)

        } catch (error: any) {
            console.error("Satış hatası:", error); // Konsola detaylı yaz

            const errorMessage = error.response?.data?.error || "Satış işlemi sırasında bir hata oluştu.";
            setMessageData({ type: 'error', message: `Hata: ${errorMessage}` });
        } finally {
            setProcessing(false);
        }
    }

    // Arama Filtresi
    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Toplam Tutar
    const totalAmount = basket.reduce((total, item) => total + (item.product.price * item.count), 0);

    if (loading) return <div className="p-10 text-center">Sistem Yükleniyor...</div>

    return (
        <div className="flex h-full overflow-hidden bg-gray-100 rounded-lg shadow-sm border border-gray-200">
            {messageData && (
                <Message
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}
            {/* SOL TARAF: ÜRÜN LİSTESİ */}
            <div className="w-2/3 p-4 flex flex-col overflow-hidden">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Barkod okutun veya ilaç adı arayın..."
                        className="w-full p-4 text-lg border-2 border-blue-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
                    {filteredProducts.map((product: any) => (
                        <div
                            key={product.id}
                            onClick={() => addToBasket(product)}
                            className={`cursor-pointer bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 ${product.how_many > 0 ? 'border-green-500' : 'border-red-500 hover:bg-red-50'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-800 text-lg truncate w-full" title={product.name}>{product.name}</h3>
                            </div>

                            {/* RESİM ALANI */}
                            <div className="h-32 w-full bg-gray-50 flex items-center justify-center mb-2 rounded overflow-hidden">
                                <img
                                    src={`/images/medicines/${product.name.toUpperCase()}.png`}
                                    alt={product.name}
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        const img = e.target as HTMLImageElement;
                                        if (img.src.includes('.png')) {
                                            img.src = img.src.replace('.png', '.jpg');
                                        } else {
                                            img.style.display = 'none';
                                        }
                                    }}
                                />
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                                <span className="bg-gray-100 px-2 py-1 rounded">{product.form_type}</span>
                                <span className={product.how_many < 10 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                                    {product.how_many} Adet
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-bold text-blue-600">₺{product.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SAĞ TARAF: SEPET / KASA */}
            <div className="w-1/3 bg-white shadow-2xl flex flex-col h-full border-l border-gray-200">
                <div className="p-4 bg-gray-800 text-white shadow-md">
                    <h2 className="text-2xl font-bold flex items-center">
                        🛒 Satış Sepeti
                    </h2>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {basket.length === 0 ? (
                        <div className="text-center text-gray-400 mt-20">
                            <p className="text-6xl mb-4">🏷️</p>
                            <p>Sepetiniz boş.</p>
                            <p className="text-sm">Ürün eklemek için sol taraftan seçim yapın.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {basket.map((item, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex justify-between items-center animate-pulse-once">
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800">{item.product.name}</div>
                                        <div className="text-xs text-gray-500">Birim: ₺{item.product.price}</div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center bg-white rounded-lg border border-gray-300">
                                            <button
                                                onClick={() => decreaseQuantity(item.product.id)}
                                                className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded-l"
                                            >-</button>
                                            <span className="px-2 font-bold text-gray-800">{item.count}</span>
                                            <button
                                                onClick={() => addToBasket(item.product)}
                                                className="px-2 py-1 text-green-600 hover:bg-gray-100 rounded-r"
                                            >+</button>
                                        </div>
                                        <div className="font-bold text-gray-800 w-16 text-right">
                                            ₺{(item.product.price * item.count).toFixed(2)}
                                        </div>
                                        <button
                                            onClick={() => removeFromBasket(item.product.id)}
                                            className="text-red-500 hover:text-red-700 p-1"
                                        >✕</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ALT KISIM: TOPLAM VE İŞLEM */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-gray-600 text-lg">Toplam Tutar</span>
                        <span className="text-4xl font-bold text-blue-700">₺{totalAmount.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={basket.length === 0 || processing}
                        className={`w-full py-4 rounded-xl text-white font-bold text-xl shadow-lg transform transition-transform active:scale-95 ${basket.length === 0
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700'
                            }`}
                    >
                        {processing ? 'İşleniyor...' : 'SATIŞI TAMAMLA'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MainPOS
