import { useEffect, useState } from 'react'
import api from '../api'

const Patients = () => {
    const [patients, setPatients] = useState([])
    const [error, setError] = useState('')

    // Güvenlik için durum değişkenleri
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [pin, setPin] = useState('')
    const CORRECT_PIN = "1234" // Eczane hasta database ortak şifresi

    useEffect(() => {
        // Sadece giriş yapıldıysa veriyi çek
        if (isAuthenticated) {
            api.get('/patients/')
                .then(response => {
                    console.log('Patients fetched:', response.data)
                    setPatients(response.data)
                })
                .catch(err => {
                    console.error('Error fetching patients:', err)
                    setError('Hasta listesi yüklenirken hata oluştu.')
                })
        }
    }, [isAuthenticated]) // isAuthenticated değişince çalışır

    const handlePinSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (pin === CORRECT_PIN) {
            setIsAuthenticated(true)
            setError('')
        } else {
            setError('Hatalı şifre!')
            setPin('')
        }
    }

    // GİRİŞ EKRANI
    if (!isAuthenticated) {
        return (
            <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center border border-gray-200">
                    <div className="mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold mb-4 text-gray-800">Güvenli Erişim</h2>
                    <p className="text-gray-600 mb-6 text-sm">Hasta verilerini görüntülemek için lütfen erişim kodunu giriniz.</p>

                    <form onSubmit={handlePinSubmit}>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded mb-4 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="****"
                            maxLength={4}
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
                        >
                            Giriş Yap
                        </button>
                    </form>
                    {error && <p className="text-red-500 mt-3 text-sm font-bold">{error}</p>}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-green-600">Hasta Listesi</h1>
                <button
                    onClick={() => setIsAuthenticated(false)}
                    className="text-sm text-gray-500 hover:text-red-500 underline"
                >
                    Güvenli Çıkış
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Hata: </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Hasta ID</th>
                            <th scope="col" className="px-6 py-3">Adı Soyadı</th>
                            <th scope="col" className="px-6 py-3">Telefon</th>
                            <th scope="col" className="px-6 py-3">Adres</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((patient: any) => (
                                <tr key={patient.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        #{patient.id}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {patient.first_name} {patient.last_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.phone_number}
                                    </td>
                                    <td className="px-6 py-4">
                                        {patient.address}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center">
                                    {error ? 'Veri yüklenemedi.' : 'Kayıtlı hasta bulunamadı.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Patients
