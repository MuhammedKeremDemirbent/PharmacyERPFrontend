import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Alert from '../components/molecules/Alert'
import Button from '../components/atoms/Button'
import Input from '../components/atoms/Input'
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { addToCart, removeFromCart, decreaseQuantity, clearCart } from '../store/slices/cartSlice'
import { useGetMedicinesQuery } from '../store/api/medicineApi'
import { useGetPatientsQuery } from '../store/api/patientApi'
import { useCheckoutMutation } from '../store/api/salesApi'

// POS Sistemi için Satış Ekranı
const MainPOS = () => {
    // State Tanımları
    const [searchTerm, setSearchTerm] = useState('') // Arama
    const [messageData, setMessageData] = useState<{ type: 'success' | 'error' | 'warning', title?: string, message: string } | null>(null)

    const [selectedPatient, setSelectedPatient] = useState<number | null>(null)

    // REDUX & RTK QUERY BAĞLANTISI
    const dispatch = useDispatch();
    const basket = useSelector((state: RootState) => state.cart.items);

    const { data: products = [], isLoading: isProductsLoading } = useGetMedicinesQuery();
    const { data: patients = [], isLoading: isPatientsLoading } = useGetPatientsQuery();
    const [checkout, { isLoading: isProcessing }] = useCheckoutMutation();

    const loading = isProductsLoading || isPatientsLoading;

    const handleAddToBasket = (product: any) => {
        dispatch(addToCart(product));
    }

    const handleRemoveFromBasket = (productId: number) => {
        dispatch(removeFromCart(productId));
    }

    const handleDecreaseQuantity = (productId: number) => {
        dispatch(decreaseQuantity(productId));
    }

    // Satışı Tamamla
    const handleCheckout = async () => {
        if (basket.length === 0) return;

        try {
            const payload = {
                items: basket.map(item => ({
                    product_id: item.product.id,
                    quantity: item.count
                })),
                patient_id: selectedPatient === 0 ? null : selectedPatient
            };

            // Idempotency Key
            const idempotencyKey = uuidv4();

            // API'ye RTK Query ile isteği at
            const response = await checkout({ data: payload, idempotencyKey }).unwrap();

            // Başarılı olursa
            console.log("Satış başarılı:", response);
            setMessageData({ type: 'success', title: 'Satış Başarılı!', message: `Satış ID: #${response.sale_id}\nToplam Tutar: ₺${response.total}` });

            dispatch(clearCart()); // Sepeti temizle 
            setSelectedPatient(null);


        } catch (err: any) {
            console.error("Satış hatası:", err);

            let errorMessage = "Satış işlemi sırasında bir hata oluştu.";

            if (err.data) {
                const data = err.data;
                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.detail) {
                    errorMessage = data.detail;
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.non_field_errors) {
                    errorMessage = data.non_field_errors[0];
                } else {
                    errorMessage = JSON.stringify(data);
                }
            } else if (err.status === 500) {
                errorMessage = "Sunucu tarafında kritik bir hata oluştu (500).";
            } else if (err.message) {
                errorMessage = err.message;
            }

            setMessageData({ type: 'error', title: 'Hata!', message: errorMessage });
        }
    }

    const filteredProducts = products.filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const totalAmount = basket.reduce((total, item) => total + (item.count * Number(item.product.price)), 0);

    if (loading) return <div className="p-10 text-center">Sistem Yükleniyor...</div>

    return (
        <div className="flex h-full gap-4 p-4 bg-muted/40">
            {messageData && (
                <Alert
                    type={messageData.type}
                    title={messageData.title}
                    message={messageData.message}
                    onClose={() => setMessageData(null)}
                />
            )}

            {/* SOL TARAF: ÜRÜN LİSTESİ */}
            <Card className="w-2/3 flex flex-col overflow-hidden border-none shadow-md">
                <div className="p-4 border-b bg-card">
                    <Input
                        type="text"
                        placeholder="Barkod okutun veya ilaç adı arayın..."
                        className="text-lg p-6 h-auto"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
                    {filteredProducts.map((product: any) => (
                        <Card
                            key={product.id}
                            onClick={() => handleAddToBasket(product)}
                            className={`cursor-pointer p-0 transition-all hover:shadow-lg border-l-4 ${product.how_many > 0
                                ? 'border-l-green-500 hover:bg-green-50/20'
                                : 'border-l-destructive hover:bg-destructive/10'
                                }`}
                        >
                            <div className="flex justify-between items-center p-4">
                                <div className="flex-1">
                                    <h3 className="font-bold text-foreground text-lg">{product.name}</h3>
                                    <span className="text-sm text-muted-foreground">{product.form_type}</span>
                                </div>

                                <div className="text-right px-6">
                                    <span className={product.how_many < 10 ? 'text-destructive font-bold block' : 'text-green-600 font-bold block'}>
                                        {product.how_many} Adet
                                    </span>
                                </div>

                                <div className="text-right min-w-[100px]">
                                    <span className="text-xl font-bold text-primary">₺{product.price}</span>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </Card>

            {/* SAĞ TARAF: SEPET / KASA */}
            <Card className="w-1/3 flex flex-col h-full shadow-xl border-none overflow-hidden">
                <div className="p-4 bg-primary text-primary-foreground shadow-md">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        🛒 Satış Sepeti
                    </h2>
                </div>

                {/* CRM: MÜŞTERİ SEÇİMİ */}
                <div className="p-4 bg-muted/30 border-b">
                    <label className="block text-xs font-bold text-muted-foreground mb-2">Müşteri Seç</label>
                    <Select
                        value={selectedPatient?.toString()}
                        onValueChange={(value) => setSelectedPatient(value ? Number(value) : null)}
                    >
                        <SelectTrigger className="w-full bg-background">
                            <SelectValue placeholder="-- Müşteri Seçilmedi --" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0">-- Müşteri Seçilmedi --</SelectItem> {/* null value hack */}
                            {patients.map((p: any) => (
                                <SelectItem key={p.id} value={p.id.toString()}>
                                    {p.first_name} {p.last_name} ({p.phone_number})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 overflow-y-auto p-4 bg-card">
                    {basket.length === 0 ? (
                        <div className="text-center text-muted-foreground mt-20 flex flex-col items-center">
                            <p className="text-6xl mb-4 opacity-50">🏷️</p>
                            <p className="font-medium">Sepetiniz boş.</p>
                            <p className="text-sm">Ürün eklemek için sol taraftan seçim yapın.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {basket.map((item, index) => (
                                <Card key={index} className="p-3 flex justify-between items-center bg-muted/10 hover:bg-muted/30 transition-colors">
                                    <div className="flex-1 min-w-0 mr-2">
                                        <div className="font-bold text-sm truncate" title={item.product.name}>{item.product.name}</div>
                                        <div className="text-xs text-muted-foreground">Birim: ₺{item.product.price}</div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center rounded-md border bg-background shadow-sm h-8">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleDecreaseQuantity(item.product.id)}
                                                className="h-full px-2 rounded-r-none hover:bg-muted"
                                            >-</Button>
                                            <span className="w-8 text-center font-bold text-sm">{item.count}</span>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleAddToBasket(item.product)}
                                                className="h-full px-2 rounded-l-none hover:bg-muted"
                                            >+</Button>
                                        </div>

                                        <div className="font-bold text-sm w-16 text-right tabular-nums">
                                            ₺{(item.count * Number(item.product.price)).toFixed(2)}
                                        </div>

                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemoveFromBasket(item.product.id)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full"
                                        >✕</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>

                {/* ALT KISIM: TOPLAM VE İŞLEM */}
                <div className="p-6 bg-muted/30 border-t">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-muted-foreground text-lg font-medium">Toplam Tutar</span>
                        <span className="text-4xl font-bold text-primary tabular-nums">₺{totalAmount.toFixed(2)}</span>
                    </div>

                    <Button
                        onClick={handleCheckout}
                        disabled={basket.length === 0 || isProcessing}
                        size="lg"
                        className={`w-full py-6 text-lg font-bold shadow-lg transition-transform active:scale-95 ${basket.length === 0
                            ? 'opacity-50 cursor-not-allowed'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                    >
                        {isProcessing ? 'İşleniyor...' : 'SATIŞI TAMAMLA'}
                    </Button>
                </div>
            </Card>
        </div>
    )
}

export default MainPOS
