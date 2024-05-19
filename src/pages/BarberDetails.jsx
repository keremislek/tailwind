import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const CommentModal = ({ comments, onClose, barberId }) => {
  const [newComment, setNewComment] = useState('');
  const customId = localStorage.getItem('id');

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {

      await API.post('/comments', {
        customerId: customId,
        barberId: barberId,
        text: newComment
      });

      onClose();
    } catch (error) {
      console.error('Yorum eklenirken bir hata oluştu:', error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/comments/${commentId}`);
    } catch (error) {
      console.error('Yorum silinirken bir hata oluştu:', error);
    }
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Yorumlar</h3>
                <div className=" px-2 py-0 sm:px-6 sm:flex sm:flex-row-reverse">
            <button onClick={onClose} type="button" className="relative top-0 right-0 -mr-3 -mt-3 w-8 h-8 inline-flex justify-center rounded-full bg-white border border-gray-300 shadow-sm px-0.5 py-0.5 text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
                <div className="mt-2">
                  {comments.map((comment, index) => (
                    <div key={index} className="border-b border-gray-200 mb-4 pb-4">
                      {comment.customerId === customId && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="text-sm text-green-500 hover:text-green-700"
                        >
                          Sil
                        </button>
                      )}
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">Müşteri:</span> {comment.customerName.toUpperCase().substring(0, 2)}{comment.customerName.toUpperCase().substring(0, 2).replace(/./g, '*')}
                        {comment.customerId === customId && (
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-sm text-green-500 hover:text-green-700"
                          >
                            Sil
                          </button>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mb-2">
                        <span className="font-semibold">Yorum:</span> {comment.text}
                        {comment.customerId === customId && (
                          <button
                            onClick={() => handleDeleteComment(comment.commentId)}
                            className="text-sm text-red-500 hover:text-red-700"
                          >
                            Sil
                          </button>
                        )}
                      </p>
                      {comment.customerId === customId && (
                        <button
                          onClick={() => handleDeleteComment(comment.commentId)}
                          className="text-sm text-red-500 hover:text-red-700"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSubmit} className="mt-4">
                  <textarea
                    value={newComment}
                    onChange={handleCommentChange}
                    className="w-full border-gray-300 rounded-md focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    rows="3"
                    placeholder="Yorumunuzu buraya yazın..."
                  ></textarea>
                  <button
                    type="submit"
                    className="mt-2 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:text-sm"
                  >
                    Yorum Ekle
                  </button>
                </form>
              </div>
            </div>
          </div>
       




        </div>
      </div>
    </div>
  );
};

const BarberDetails = () => {
  const [rating, setRating] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { barberId } = useParams();

  const [barbers, setBarbers] = useState([]);
  const [servicesInfo, setServicesInfo] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [comments, setComments] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [formData, setFormData] = useState({
    serviceIds: [],
    availableHours: Array(12).fill().map((_, index) => availableHours[`t${index + 1}`] === 'T' ? 'T' : 'F'),
    date: new Date(),
    userId: null
  });


const handleAddToCart = (service) => {
  // Daha önce sepete eklenmemişse hizmeti sepete ekle
  if (!cart.find(item => item.id === service.id)) {
    setCart(prevCart => [...prevCart, service]);
    setFormData(prevState=>({
      ...prevState,
      serviceIds:[...prevState.serviceIds,service.id]
    }))
  }
};
const handleRemoveFromCart = (serviceId) => {
  // Sepetten hizmeti çıkar
  setCart(prevCart => prevCart.filter(item => item.id !== serviceId));
  setFormData(prevState => ({
    ...prevState,
    serviceIds: prevState.serviceIds.filter(id => id !== serviceId),
  }));
};




  useEffect(() => {
    const fetchData = async () => {
      try {
        const barberResponse = await API.get(`/barbers/${barberId}`);
        setBarbers(barberResponse.data);

        const servicesResponse = await API.get(`/servicesInfo/barber/${barberId}`);
        setServicesInfo(servicesResponse.data);

        const availableResponse = await API.get(`/appointments/available/${barberId}`);
        setAvailableHours(availableResponse.data);

        const commentResponse = await API.get(`/comments/barber/${barberId}`)
        setComments(commentResponse.data)

      } catch (error) {
        console.error("Fetch Data Error: ", error.response ? error.response.data : error.message);
      }
    };
    fetchData();
  }, [barberId]);

  const [workHours, setWorkHours] = useState([]);

  useEffect(() => {
    const hours = Array(12).fill().map((_, index) => ({
      hour: (9 + index) % 24,
      disabled: availableHours[`t${index + 1}`] === 'T',
      color: availableHours[`t${index + 1}`] === 'T' ? 'bg-red-500' : 'bg-blue-500 hover:bg-blue-700'
    }));
    setWorkHours(hours);
  }, [availableHours]);

  //formDataya gönderilecek olan kısım
  useEffect(() => {
    const hours = Array(12).fill().map((_, index) => availableHours[`t${index + 1}`] === 'T' ? 'T' : 'F');
    setFormData(prevFormData => ({
      ...prevFormData,
      availableHours: hours
    }));
  }, [availableHours]);

  const handleHourClick = (hour) => {
    const updatedHours = workHours.map(hourData => {
      if (hourData.hour === hour) {
        return { ...hourData, disabled: true }; // Tıklanan saati disable yap
      }
      
      return hourData;
    });
  
    // Güncellenmiş saat durumlarını state içinde tut
    setWorkHours(updatedHours);
  
    // FormData'yı güncelle, seçilen saati "T" olarak ayarla
    setFormData(prevFormData => ({
      ...prevFormData,
      availableHours: prevFormData.availableHours.map((value, index) => index + 9 === hour ? 'T' : value)
    }));
  };

  const handleConfirmAndContinue = async () => {
    try {
        const userId=localStorage.getItem("id");
       
        const requestData = {
        barberId: barberId,
        date: formData.date,
        serviceIds: formData.serviceIds,
        userId: userId,
        t1: formData.availableHours[0],
        t2: formData.availableHours[1],
        t3: formData.availableHours[2],
        t4: formData.availableHours[3],
        t5: formData.availableHours[4],
        t6: formData.availableHours[5],
        t7: formData.availableHours[6],
        t8: formData.availableHours[7],
        t9: formData.availableHours[8],
        t10: formData.availableHours[9],
        t11: formData.availableHours[10],
        t12: formData.availableHours[11]
      };
  
      await API.post("/appointments/createOrUpdate", requestData);
  
      alert("Randevu oluşturuldu!");
  
     
      setCart([]);
      setIsCartOpen(false);
    } catch (error) {
      console.error("Confirm and Continue Error: ", error.response ? error.response.data : error.message);
      // Hata mesajını göster
      alert("Randevu oluşturulurken bir hata oluştu.");
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleStarClick = async (rate) => {
    // Kullanıcı zaten puan vermişse işlem yapma
    if (isRated) return;

    try {
      // Backend'e puan verme isteği gönder
      await API.post("/ratings/create", {
        rate: rate,
        customerId: localStorage.getItem("id"),
        barberId: barberId,
      });
      // Puanlama başarılıysa puanı ayarla ve kullanıcının zaten puan verdiğini işaretle
      setRating(rate);
      setIsRated(true);
    } catch (error) {
      console.error("Rating Error: ", error.response ? error.response.data : error.message);
    }
  };

  // Yıldız simgeleri için JSX oluştur
  const renderStars = () => {
    const stars = [];
    // Toplam 5 yıldız var
    for (let i = 1; i <= 5; i++) {
      // Her yıldızı oluştururken tıklanabilir olup olmadığını kontrol et
      const clickable = !isRated;
      // Tıklanabilirse, handleStarClick fonksiyonunu puanla ve parametre olarak yıldızın sırasını gönder
      stars.push(
        <span
          key={i}
          className={`text-2xl cursor-pointer ${clickable ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400'}`}
          onClick={() => clickable && handleStarClick(i)}
        >
          {rating >= i ? '★' : '☆'}
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    console.log("availableHours:", formData.availableHours);
  }, [formData.availableHours]);



  return (

    <div className="font-sans">
      <div className="container mx-auto py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-10 ">
          <div className="w-full lg:h-72 mt-0 top-0 text-center">
            <h2 className="text-left font-bold text-gray-800 mt-4">{barbers.barberName}</h2>
            <img src={barbers.photoUrl} width="200" height="200" alt="Product" className="lg:w-10/12 w-full h-full rounded-xl object-cover object-top" />
            <div className="flex flex-wrap gap-4 mr-left">
              <button type="button" className="px-2.5 py-1.5 bg-pink-100 text-xs text-pink-600 rounded-md flex items-center">
                <svg className="w-3 mr-1" fill="currentColor" viewBox="0 0 14 13" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                </svg>
                {barbers.rate}
              </button>
              <div>
                <div className="flex items-center space-x-1">
                  <p className="text-gray-600">Puanınızı Verin:</p>
                  {renderStars()}
                </div>
              </div>
              <button type="button" className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 mr-1" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M14.236 21.954h-3.6c-.91 0-1.65-.74-1.65-1.65v-7.201c0-.91.74-1.65 1.65-1.65h3.6a.75.75 0 0 1 .75.75v9.001a.75.75 0 0 1-.75.75zm-3.6-9.001a.15.15 0 0 0-.15.15v7.2a.15.15 0 0 0 .15.151h2.85v-7.501z" data-original="#000000" />
                  <path d="M20.52 21.954h-6.284a.75.75 0 0 1-.75-.75v-9.001c0-.257.132-.495.348-.633.017-.011 1.717-1.118 2.037-3.25.18-1.184 1.118-2.089 2.28-2.201a2.557 2.557 0 0 1 2.17.868c.489.56.71 1.305.609 2.042a9.468 9.468 0 0 1-.678 2.424h.943a2.56 2.56 0 0 1 1.918.862c.483.547.708 1.279.617 2.006l-.675 5.401a2.565 2.565 0 0 1-2.535 2.232zm-5.534-1.5h5.533a1.06 1.06 0 0 0 1.048-.922l.675-5.397a1.046 1.046 0 0 0-1.047-1.182h-2.16a.751.751 0 0 1-.648-1.13 8.147 8.147 0 0 0 1.057-3 1.059 1.059 0 0 0-.254-.852 1.057 1.057 0 0 0-.795-.365c-.577.052-.964.435-1.04.938-.326 2.163-1.71 3.507-2.369 4.036v7.874z" data-original="#000000" />
                  <path d="M4 31.75a.75.75 0 0 1-.612-1.184c1.014-1.428 1.643-2.999 1.869-4.667.032-.241.055-.485.07-.719A14.701 14.701 0 0 1 1.25 15C1.25 6.867 7.867.25 16 .25S30.75 6.867 30.75 15 24.133 29.75 16 29.75a14.57 14.57 0 0 1-5.594-1.101c-2.179 2.045-4.61 2.81-6.281 3.09A.774.774 0 0 1 4 31.75zm12-30C8.694 1.75 2.75 7.694 2.75 15c0 3.52 1.375 6.845 3.872 9.362a.75.75 0 0 1 .217.55c-.01.373-.042.78-.095 1.186A11.715 11.715 0 0 1 5.58 29.83a10.387 10.387 0 0 0 3.898-2.37l.231-.23a.75.75 0 0 1 .84-.153A13.072 13.072 0 0 0 16 28.25c7.306 0 13.25-5.944 13.25-13.25S23.306 1.75 16 1.75z" data-original="#000000" />
                </svg>
                {barbers.commentSize}
              </button>
              <button type="button" onClick={openModal} className="px-2.5 py-1.5 bg-gray-100 text-xs text-gray-800 rounded-md flex items-center">
                Yorumları Gör
              </button>
              {showModal && <CommentModal comments={comments} onClose={closeModal} barberId={barberId} />}
            </div>
            <div className="ml-left">
              <p className="mr-0">{barbers.address}</p>
            </div>
          </div>

          <div className="ml-auto">
            <div className="flex flex-wrap items-start gap-0">
              <div className="ml-left gap-4">
                <h2 className="text-2xl font-extrabold text-gray-800">Berber Sayfası</h2>
                <p className="text-sm text-gray-400 mt-2">en iyi berberler hizmetinizde</p>
              </div>
              <div className="flex flex-wrap gap-4 ml-auto">
              <div className="ml-left mt-8">
        <h3 className="text-sm font-bold text-gray-800">Sepet</h3>
        <button
             onClick={() => setIsCartOpen(!isCartOpen)} // Sepet düğmesine tıklandığında sepetin gösterilip gösterilmeyeceğini tersine çevir
             className={`px-2.5 py-1.5 bg-${isCartOpen ? 'red' : 'gray'}-100 text-xs text-gray-800 rounded-md flex items-center`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12px" fill="currentColor" viewBox="0 0 512 512">
              <path d="M453.332 85.332c0 38.293-31.039 69.336-69.332 69.336s-69.332-31.043-69.332-69.336C314.668 47.043 345.707 16 384 16s69.332 31.043 69.332 69.332zm0 0" data-original="#000000" />
              <path d="M384 170.668c-47.063 0-85.332-38.273-85.332-85.336C298.668 38.273 336.938 0 384 0s85.332 38.273 85.332 85.336c0 47.063-38.27 85.336-85.332 85.336zM384 32c-29.418 0-53.332 23.938-53.332 53.332 0 29.398 23.914 53.336 53.332 53.336s53.332-23.938 53.332-53.336C437.332 55.938 413.418 32 384 32zm69.332 394.668C453.332 464.957 422.293 496 384 496s-69.332-31.043-69.332-69.332c0-38.293 31.039-69.336 69.332-69.336s69.332 31.043 69.332 69.336zm0 0" data-original="#000000" />
              <path d="M384 512c-47.063 0-85.332-38.273-85.332-85.332 0-47.063 38.27-85.336 85.332-85.336s85.332 38.273 85.332 85.336c0 47.059-38.27 85.332-85.332 85.332zm0-138.668c-29.418 0-53.332 23.938-53.332 53.336C330.668 456.063 354.582 480 384 480s53.332-23.937 53.332-53.332c0-29.398-23.914-53.336-53.332-53.336zm0 0M512 341.332c0 75.191-61.141 136.332-136.332 136.332S239.336 416.523 239.336 341.332 300.477 205 375.668 205s136.332 61.141 136.332 136.332zm0 0" data-original="#000000" />
              <path d="M375.668 341.332c0 29.398-23.934 53.332-53.332 53.332s-53.332-23.934-53.332-53.332c0-29.402 23.934-53.336 53.332-53.336s53.332 23.934 53.332 53.336zm0 0" data-original="#000000" />
            </svg>
            {cart.length > 0 && ` (${cart.length})`} {/* Sepete eklenen hizmet sayısını göster */}
          </button>
          {isCartOpen && (
  <div className="mt-4">
    <table className="border-collapse w-full">
      <thead>
        <tr className="border-b border-gray-200">
          <th class="py-2 px-4 border border-gray-200">Hizmet Adı</th>
          <th class="py-2 px-4 border border-gray-200">Fiyat (TL)</th>
          <th class="py-2 px-4 border border-gray-200">Süre (DK)</th>
         
          <th className="py-2">İşlem</th>
        </tr>
      </thead>
      <tbody>
        {cart.map((item, index) => (
          <tr key={index} className="border-b border-gray-200">
            <td class="py-2 px-4 border border-gray-200">{item.serviceName}</td>
            <td class="py-2 px-4 border border-gray-200">{item.price} TL</td>
            <td class="py-2 px-4 border border-gray-200">{item.time} DK</td>
     
            <td className="py-2">
              <button 
                type="button" 
                className="w-12 h-12 border-2 bg-red-700 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0"
                onClick={() => handleRemoveFromCart(item.id)}>Çıkar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <button
        type="button"
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        onClick={handleConfirmAndContinue}
      >
        Onayla ve Devam Et
      </button>

  </div>
)}

      </div>
                
              </div>
            </div>
            <div>
              <h3 class="text-lg font-bold text-gray-800">Hizmetler Tablosu</h3>
              <table class="w-full mt-4">
                <thead>
                  <tr>
                    <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Hizmet Adı</th>
                    <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Zaman (Dakika)</th>
                    <th class="py-2 px-4 bg-gray-100 text-gray-800 font-semibold">Fiyat (TL)</th>
                  </tr>
                </thead>
                <tbody>
                  {servicesInfo.map((service, index) => (
                    <tr key={index}>
                      <td class="py-2 px-4 border border-gray-200">{service.serviceName}</td>
                      <td class="py-2 px-4 border border-gray-200">{service.price}</td>
                      <td class="py-2 px-4 border border-gray-200">{service.time}</td>
                      <td></td>
                      <td>
                   
                      </td>
                      
                      <td>
                      <button 
                    type="button" 
                    className="w-12 h-12 border-2 bg-sky-200 hover:bg-sky-900 hover:border-gray-800 font-semibold text-sm rounded-md flex items-center justify-center shrink-0"
                    onClick={() => handleAddToCart(service)}>
                    Ekle
                  </button>
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </div>



            <div className="ml-left">
              <h3 className="text-lg font-bold text-gray-800">Çalışma Saatleri</h3>
              <div className="flex flex-wrap gap-4 mt-4">
                {workHours.map((hourData, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`w-12 h-12 border-2 hover:border-gray-800 font-semibold text-sm rounded-full flex items-center justify-center shrink-0 ${hourData.color}`}
                    onClick={() => handleHourClick(hourData.hour)}
                    disabled={hourData.disabled}
                  >
                    {hourData.hour < 10 ? "0" + hourData.hour : hourData.hour}:00
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDetails;
